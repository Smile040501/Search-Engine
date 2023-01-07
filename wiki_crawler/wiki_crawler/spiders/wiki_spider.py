from ..preProcess import preProcessStr, normalizeStr
from scrapy.exceptions import CloseSpider
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule


class WikiSpiderSpider(CrawlSpider):
    name = "wiki_spider"
    allowed_domains = ["en.wikipedia.org"]

    start_urls = [
        "https://en.wikipedia.org/wiki/List_of_Marvel_Cinematic_Universe_films"
    ]

    allow_urls = [r"wiki/"]
    deny_urls = [
        r"wiki/Main_Page",
        r"wiki/Category:",
        r"wiki/Help:",
        r"wiki/ISO",
        r"wiki/Portal:",
        r"wiki/Special:",
        r"wiki/Talk:",
        r"wiki/Template:",
        r"wiki/Template_talk:",
        r"wiki/User_talk:",
        r"wiki/Wikipedia:",
        r"wiki/Wikipedia_talk:",
    ]
    rules = (
        Rule(
            LinkExtractor(allow=allow_urls, deny=deny_urls),
            callback="parse_item",
            follow=True,
        ),
    )

    N = 15000
    count = 0

    def parse_item(self, response):
        if self.count >= self.N:
            raise CloseSpider(f"Scraped {self.N} items. Eject!")

        self.count += 1

        data = {}
        data["page_url"] = response.url

        data["page_title"] = "".join(
            response.xpath(
                '//*[@id="firstHeading"]/descendant-or-self::*/text()'
            ).getall()
        )

        maxDescriptionLen = 157
        description = ""
        totalP = int(float(response.xpath("count(/descendant::p)").get()))
        numP = 0
        while len(description) < maxDescriptionLen and numP < totalP:
            description += normalizeStr(
                " ".join(
                    response.xpath(
                        f"/descendant::p[{numP}]/descendant-or-self::*/text()"
                    ).getall()
                )
            )
            numP += 1

        description = normalizeStr(description).strip()
        data["page_description"] = (
            (description[:maxDescriptionLen] + "...")
            if len(description) > maxDescriptionLen
            else description
        )

        data["page_content"] = preProcessStr(
            " ".join(response.xpath("//p/descendant-or-self::*/text()").getall())
        )

        headings = {}
        for i in range(2, 7):
            head_val = preProcessStr(
                " ".join(
                    response.xpath(f"//h{i}/descendant-or-self::*/text()").getall()
                )
            )
            if head_val:
                headings[f"h{i}"] = head_val

        data |= headings

        info_card = {}
        rows = response.xpath(
            '//*[@id="mw-content-text"]/div[1]/table[contains(@class, "infobox")]/tbody/tr'
        )
        for row in rows:
            if row.xpath('./th[@class="infobox-above summary"]'):
                continue

            img_box = row.xpath(
                './td[@class="infobox-image"]/a[@class="image"]/img/@src'
            )
            if img_box:
                info_card["img_url"] = img_box.get()
                continue

            label_box = row.xpath('./th[@class="infobox-label"]')
            if label_box:
                key = preProcessStr(
                    " ".join(
                        label_box.xpath(".//descendant-or-self::*/text()").getall()
                    )
                )

                if not key:
                    continue

                label_data = row.xpath('./td[@class="infobox-data"]')
                if label_data:
                    value = preProcessStr(
                        " ".join(
                            label_data.xpath(".//descendant-or-self::*/text()").getall()
                        )
                    )

                    if value:
                        info_card[key] = value

        data |= info_card

        # Invoking the shell from spiders to inspect responses
        # from scrapy.shell import inspect_response
        # inspect_response(response, self)
        return data
