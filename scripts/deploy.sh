#!/bin/bash
set -e

# Deploy a Node.js web app to AWS Lambda + API Gateway
# Usage: ./scripts/deploy.sh <function-name> [region]

FUNCTION_NAME=${1:-my-app}
REGION=${2:-us-east-1}
ROLE_ARN=${AWS_LAMBDA_ROLE_ARN:-arn:aws:iam::ACCOUNT:role/lambda-bedrock-role}

echo "📦 Packaging app for Lambda..."
zip -r lambda-package.zip server.js public/ node_modules/ package.json > /dev/null 2>&1

echo "🚀 Deploying to Lambda..."
aws lambda create-function \
  --function-name "$FUNCTION_NAME" \
  --runtime nodejs18.x \
  --role "$ROLE_ARN" \
  --handler server.handler \
  --zip-file fileb://lambda-package.zip \
  --region "$REGION" \
  --timeout 30 \
  --memory-size 256 \
  --environment Variables="{AWS_PROFILE=hackathon}" \
  2>/dev/null || \
aws lambda update-function-code \
  --function-name "$FUNCTION_NAME" \
  --zip-file fileb://lambda-package.zip \
  --region "$REGION" > /dev/null 2>&1

echo "✅ Deployed to Lambda: $FUNCTION_NAME"
echo "📝 Next: Create an API Gateway endpoint pointing to this function"
echo "   Then add an S3 bucket to serve public/ as a static site"
echo "🧪 Test with: aws lambda invoke --function-name $FUNCTION_NAME --payload '{}' output.json"

rm lambda-package.zip
