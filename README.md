1 - File serverless.yml contains configuration for importProductsFile function - **DONE**
3 - The importProductsFile lambda function returns a correct response which can be used to upload a file into the S3 bucket - **DONE**
4 - Frontend application is integrated with importProductsFile lambda - **DONE**
5 - The importFileParser lambda function is implemented and serverless.yml contains configuration for the lambda - **DONE**
Additional (optional) tasks
+1 - async/await is used in lambda functions - **DONE**
+1 - importProductsFile lambda is covered by unit tests (aws-sdk-mock can be used to mock S3 methods - https://www.npmjs.com/package/aws-sdk-mock)
+1 - At the end of the stream the lambda function should move the file from the uploaded folder into the parsed folder (move the file means that file should be copied into parsed folder, and then deleted from uploaded folder) - **DONE**

importProductsFile BE - https://nq9cpkypba.execute-api.us-east-1.amazonaws.com/dev/import?filename=products.csv
FE - https://d31h207unn4y4r.cloudfront.net/
