# Create lambda function
data "archive_file" "lambda_2" {
  type        = "zip"
  source_file = "../dist/invocable-importer.js"
  output_path = "../dist/invocable-importer.zip"
}
resource "aws_lambda_function" "invocable_importer" {
  filename      = "../dist/invocable-importer.zip"
  function_name = "b3-invocable-importer"
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "invocable-importer.handler"

  source_code_hash = data.archive_file.lambda_2.output_base64sha256
  timeout = 30

  runtime = "nodejs18.x"
  layers = [aws_lambda_layer_version.stock_finder_layer.arn]

  environment {
    variables = local.env_vars
  }
}

# Create SQS Trigger
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = data.aws_sqs_queue.my_queue.arn
  function_name    = aws_lambda_function.invocable_importer.arn
  batch_size       = 10 
}