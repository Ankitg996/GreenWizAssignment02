import axios from "axios";
import cheerio from "cheerio";


async function getLinksFromURL(url) {
    try {
        let links = [];
        let httpResponse = await axios.get(url);
        console.log(httpResponse);

        let $ = cheerio.load(httpResponse.data);
        let linkObjects = $('img'); // get all hyperlinks

        linkObjects.each((index, element) => {
            links.push({
                alt: $(element).attr('alt'), // get the text
                src: $(element).attr('src'), // get the href attribute
            });
        });

        return links;
    } catch (e) { console.log(e) }

}

export default getLinksFromURL