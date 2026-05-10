import csv
import json

result = {}

with open("zipcode_city.csv", newline="") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        zipcode = row["zipcode"]

        result[zipcode] = {
            "city": row["city"],
            "state": row["state"],
            "latitude": row["latitude"],
            "longitude": row["longitude"]
        }

with open("zipcode_city.json", "w") as jsonfile:
    json.dump(result, jsonfile, indent=4)

print("Finished conversion from zipcode_city.csv to zipcode_city.json")
