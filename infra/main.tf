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
  managed_policy_arns = ["arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"]
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

#Create policy to allow lambda to access SQS
resource "aws_iam_policy" "lambda_sqs_policy" {
  name   = "lambda_sqs_policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect   = "Allow",
        Action   = "sqs:*",
        Resource = data.aws_sqs_queue.my_queue.arn
      },

    ]
  })
}

# Attach RDS policy to role
resource "aws_iam_role_policy_attachment" "lambda_rds_access_attachment" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_rds_access_policy.arn
}

# Attach SQS policy to role
resource "aws_iam_role_policy_attachment" "lambda_sqs_policy_attachment" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_sqs_policy.arn
}

# Define Queue
data "aws_sqs_queue" "my_queue" {
  name = "b3finder-queue"
}

# Lambda SQS Permission
resource "aws_lambda_permission" "sqs_permission" {
  statement_id  = "AllowExecutionFromSQS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.invocable_importer.arn
  principal     = "sqs.amazonaws.com"

  source_arn    = data.aws_sqs_queue.my_queue.arn
}