workflow "New workflow" {
  on = "push"
  resolves = ["Deploy"]
}

action "Build" {
  uses = "actions/npm@6309cd9"
  args = "run build"
}

action "Deploy" {
  uses = "actions/aws/cli@8d31870"
  needs = ["Build"]
  args = "lambda update-function-code --function-name \"arn:aws:lambda:us-west-2:072032131665:function:aws-serverless-repository-alexaskillskitnodejsfact-1DNW9J10BFSSG\" --zip-file \"fileb://./dist/lambda.zip\" --region us-west-2"
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
}
