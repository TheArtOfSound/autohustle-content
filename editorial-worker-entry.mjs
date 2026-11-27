// Production editorial Worker entry point. Deploy this entry rather than the legacy base alone.
import base from "./editorial-edge-worker-20261127.js";
import {integrateEditorial} from "./editorial/ecosystem-integration.mjs";
export default integrateEditorial(base);
