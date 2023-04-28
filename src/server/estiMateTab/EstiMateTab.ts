import { PreventIframe } from "express-msteams-host";

/**
 * Used as place holder for the decorators
 */
@PreventIframe("/estiMateTab/index.html")
@PreventIframe("/estiMateTab/config.html")
@PreventIframe("/estiMateTab/remove.html")
export class EstiMateTab {
}
