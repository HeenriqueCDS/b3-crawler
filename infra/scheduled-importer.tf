#Define envs vars
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

# Create policy to allow lambda to assume role
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

# Create IAM role for lambda
resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# Create policy to allow lambda to access RDS
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

# Attach policy to role
resource "aws_iam_role_policy_attachment" "lambda_rds_access_attachment" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_rds_access_policy.arn
}

# Create lambda function
data "archive_file" "lambda" {
  type        = "zip"
  source_file = "../dist/scheduled-importer.js"
  output_path = "../dist/scheduled-importer.zip"
}
resource "aws_lambda_function" "scheduled_importer" {
  filename      = "../dist/scheduled-importer.zip"
  function_name = "scheduled-importer-tf"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "scheduled-importer.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  runtime = "nodejs18.x"

  environment {
    variables = local.env_vars
  }
}

# Create CloudWatch Event Rule
resource "aws_cloudwatch_event_rule" "every_day" {
    name = "every-day"
    description = "Fires every day at 15:00"
    schedule_expression = "cron(0 15 ? * MON-FRI *)"
}
resource "aws_cloudwatch_event_target" "scheduled_importer_every_day" {
    rule = aws_cloudwatch_event_rule.every_day.name
    target_id = "scheduled_importer"
    arn = aws_lambda_function.scheduled_importer.arn
}

resource "aws_lambda_permission" "allow_cloudwatch_to_call_scheduled_importer" {
    statement_id = "AllowExecutionFromCloudWatch"
    action = "lambda:InvokeFunction"
    function_name = aws_lambda_function.scheduled_importer.function_name
    principal = "events.amazonaws.com"
    source_arn = aws_cloudwatch_event_rule.every_day.arn
}
