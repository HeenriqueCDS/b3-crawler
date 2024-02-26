# Create layer for lambda
resource "aws_lambda_layer_version" "stock_finder_layer" {
  filename   = "nodejs.zip" 
  layer_name = "stock_finder_layer"
  compatible_runtimes = ["nodejs18.x", "nodejs20.x"]
}
