variable "environment_variables" {
  type    = map(string)
  default = {}
}

locals {
  env_vars = merge(
    var.environment_variables,
    jsondecode(file("variables.tfvars"))
  )
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_policy" "lambda_rds_access_policy" {
  name        = "lambda_rds_access_policy"
  description = "Allows Lambda function to access RDS"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "rds-db:connect"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_rds_access_attachment" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_rds_access_policy.arn
}


data "archive_file" "lambda" {
  type        = "zip"
  source_file = "dist/scheduled-importer.js"
  output_path = "dist/scheduled-importer.zip"
}

resource "aws_lambda_function" "scheduled_importer" {
  # If the file is not in the current working directory you will need to include a
  # path.module in the filename.
  filename      = "dist/scheduled-importer.zip"
  function_name = "scheduled-importer-tf"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "scheduled-importer.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs18.x"

  environment {
    variables = local.env_vars
  }
}
