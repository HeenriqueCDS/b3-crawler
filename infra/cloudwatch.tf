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
