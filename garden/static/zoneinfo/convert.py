import csv
import json

result = {}

with open("zipcode_zone.csv", newline="") as csvfile:
    reader = csv.DictReader(csvfile)

    for row in reader:
        zipcode = row["zipcode"]

        result[zipcode] = {
            "zone": row["zone"],
            "trange": row["trange"],
            "zonetitle": row["zonetitle"]
        }

with open("zipcode_zone.json", "w") as jsonfile:
    json.dump(result, jsonfile, indent=4)

print("Finished conversion from zipcode_zone.csv to zipcode_zone.json")
