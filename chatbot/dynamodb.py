import boto3
import json
from decimal import Decimal


session = boto3.Session(
    aws_access_key_id="aws_access_key_id",
    aws_secret_access_key="aws_secret_access_key",
    region_name="us-east-1"
)

dynamodb = session.resource("dynamodb")
table = dynamodb.Table("Disasters")

print("Connected to DynamoDB!")

response = table.scan()

# Convert Decimal values back to float for printing
def convert_decimal(obj):
    if isinstance(obj, list):
        return [convert_decimal(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    return obj

# Convert and print data
items = convert_decimal(response["Items"])
print(json.dumps(items, indent=4))