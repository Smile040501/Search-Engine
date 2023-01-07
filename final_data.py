# Convert to .ndjson file using the command
# cat <file.json> | jq -c '.[]' > <file.ndjson>

import json

DATA_DIR = "scraped_data"
IN_FILENAME = f"{DATA_DIR}/scraped_data.json"
OUT_FILENAME = f"{DATA_DIR}/final_data.json"

with open(IN_FILENAME, "r", encoding="utf-8") as jsonFile:
    values = json.load(jsonFile)

NO_IMG_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFG5-XTBYvoFjptCqHdiL_PXjkphJ3yGDxJ_tska9MH2XJWNQ5EIOO0maRAVRCqfXT4oI&usqp=CAU"

output = []
for val in values:
    output.append(
        {
            "page_url": val["page_url"],
            "page_title": val["page_title"],
            "page_description": val["page_description"],
            "page_content": val["page_content"],
            "img_url": val.get("img_url", NO_IMG_URL),
        }
    )


with open(OUT_FILENAME, "w", encoding="utf-8") as outfile:
    json.dump(output, outfile)
