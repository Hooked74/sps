/// <reference types="@h74-sps/types" />

import * as extensions from "./extensions";
import joi from "joi";

const validation = joi.extend(...Object.values(extensions)) as typeof joi;

export const ValidationException = joi.ValidationError;

export default validation;
