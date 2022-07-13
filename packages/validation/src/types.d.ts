/// <reference types="@h74-sps/types" />

import Joi from "joi";
import semver from "semver";

declare module "joi" {
  type SemverVersion = string | semver.SemVer;
  type SemverRange = string | semver.Range;

  interface SemverSchema extends Joi.StringSchema {
    gt: (version: SemverVersion) => Joi.StringSchema;
    gte: (version: SemverVersion) => Joi.StringSchema;
    lt: (version: SemverVersion) => Joi.StringSchema;
    lte: (version: SemverVersion) => Joi.StringSchema;
    eq: (version: SemverVersion) => Joi.StringSchema;
    neq: (version: SemverVersion) => Joi.StringSchema;
    cmp: (operator: semver.Operator, version: SemverVersion) => Joi.StringSchema;
    outside: (range: SemverRange, hilo: Parameters<typeof semver.outside>[2]) => Joi.StringSchema;
    satisfies: (range: SemverRange) => Joi.StringSchema;
    gtr: (range: SemverRange) => Joi.StringSchema;
    ltr: (range: SemverRange) => Joi.StringSchema;
  }

  export interface Root {
    semver(): SemverSchema;
    semverRange(): Joi.StringSchema;
    ValidationException: typeof Joi.ValidationError;
  }
}

export = Joi;
