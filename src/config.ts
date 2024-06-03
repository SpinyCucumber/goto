import axios from "axios";

export interface ILink {
    name: string;
    uri: string;
    tags?: string[];
}

export interface IConfig {
    extends?: string[]
    links?: ILink[]
}

export async function getLinks(config: IConfig) {
    let links: ILink[] = [];
    // For each parent config, make request to provided URI and collect links
    if (config.extends !== undefined) {
        for (const uri of config.extends) {
            const parent = (await axios.get<IConfig>(uri)).data;
            const parentLinks = await getLinks(parent);
            links = [...links, ...parentLinks];
        }
    }
    if (config.links !== undefined) {
        links = [...links, ...config.links];
    }
    return links;
}