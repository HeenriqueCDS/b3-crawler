# Create lambda function
data "archive_file" "lambda" {
  type        = "zip"
  source_file = "../dist/scheduled-importer.js"
  output_path = "../dist/scheduled-importer.zip"
}
resource "aws_lambda_function" "scheduled_importer" {
  filename      = "../dist/scheduled-importer.zip"
  function_name = "b3-scheduled-importer"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "scheduled-importer.handler"

  source_code_hash = data.archive_file.lambda.output_base64sha256
  timeout = 60

  runtime = "nodejs18.x"
  layers = [aws_lambda_layer_version.stock_finder_layer.arn]

  environment {
    variables = local.env_vars
  }
}