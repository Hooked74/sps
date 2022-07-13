import { ExtensionFactory, Extension } from "joi";
import semver from "semver";

const EXTENSION_NAME = "semver";

const rules: Extension["rules"] = {
  compare: {
    method: false,
    validate(value, helpers, { exp }, { name }) {
      return (semver as any)[name](value, exp)
        ? value
        : helpers.error(`${EXTENSION_NAME}.${name}`, { exp });
    },
    args: [
      {
        name: "exp",
        assert: semver.valid as any,
        message: "needs to be a valid semver expression",
      },
    ],
  },
  cmp: {
    method(cmp, exp) {
      return this.$_addRule({ name: "cmp", args: { cmp, exp } });
    },
    validate(value, helpers, { cmp, exp }) {
      return semver.cmp(value, cmp, exp)
        ? value
        : helpers.error(`${EXTENSION_NAME}.cmp`, { cmp, exp });
    },
    args: [
      {
        name: "cmp",
        assert(cmp) {
          return ["===", "!==", "", "=", "==", "!=", ">", ">=", "<", "<="].includes(cmp);
        },
        message: "needs to be a valid comparator",
      },
      {
        name: "exp",
        assert: semver.valid as any,
        message: "needs to be a valid semver expression",
      },
    ],
  },
  compareRange: {
    method: false,
    validate(value, helpers, { rng }, { name }) {
      return (semver as any)[name](value, rng)
        ? value
        : helpers.error(`${EXTENSION_NAME}.${name}`, { rng });
    },
    args: [
      {
        name: "rng",
        assert: semver.validRange as any,
        message: "needs to be a valid semver range",
      },
    ],
  },
  outside: {
    method(rng, hilo) {
      return this.$_addRule({ name: "outside", args: { hilo, rng } });
    },
    validate(value, helpers, { hilo, rng }) {
      return semver.outside(value, rng, hilo)
        ? value
        : helpers.error(`${EXTENSION_NAME}.outside`, { hilo, rng });
    },
    args: [
      {
        name: "rng",
        assert: semver.validRange as any,
        message: "needs to be a valid semver range",
      },
      {
        name: "hilo",
        assert(hilo) {
          return [">", "<"].includes(hilo);
        },
        message: "needs to be a valid comparator",
      },
    ],
  },
};

["gt", "gte", "lt", "lte", "eq", "neq"].forEach((name) => {
  rules[name] = {
    method(exp) {
      return this.$_addRule({ name, method: "compare", args: { exp } } as any);
    },
  };
});

["satisfies", "gtr", "ltr"].forEach((name) => {
  rules[name] = {
    method(rng) {
      return this.$_addRule({ name, method: "compareRange", args: { rng } } as any);
    },
  };
});

export const semverExtension: ExtensionFactory = (joi) => ({
  base: joi.string(),
  type: "semver",
  validate: function (value: any, { error }: any) {
    return semver.valid(value) ? { value } : { errors: error(`${EXTENSION_NAME}.valid`) };
  },
  messages: {
    [`${EXTENSION_NAME}.valid`]: "{{#label}} needs to be a valid semver expression",
    [`${EXTENSION_NAME}.gt`]: "{{#label}} needs to be greater than {{#exp}}",
    [`${EXTENSION_NAME}.gte`]: "{{#label}} needs to be greater than or equal to {{#exp}}",
    [`${EXTENSION_NAME}.lt`]: "{{#label}} needs to be less than {{#exp}}",
    [`${EXTENSION_NAME}.lte`]: "{{#label}} needs to be less than or equal to {{#exp}}",
    [`${EXTENSION_NAME}.eq`]: "{{#label}} needs to be logically equivalent to {{#exp}}",
    [`${EXTENSION_NAME}.neq`]: "{{#label}} needs to be logically different than {{#exp}}",
    [`${EXTENSION_NAME}.cmp`]: "{{#label}} needs to satisfy {{#cmp}} on {{#exp}}",
    [`${EXTENSION_NAME}.satisfies`]: "{{#label}} needs to satisfy {{#rng}}",
    [`${EXTENSION_NAME}.gtr`]: "{{#label}} needs to be greater than range {{#rng}}",
    [`${EXTENSION_NAME}.ltr`]: "{{#label}} needs to be less than range {{#rng}}",
    [`${EXTENSION_NAME}.outside`]: "{{#label}} needs to be {{#hilo}} than range {{#rng}}",
  },
  rules,
});

export const semverRangeExtension: ExtensionFactory = (joi) => ({
  base: joi.string(),
  type: "semverRange",
  validate(value, { error }) {
    return semver.validRange(value) ? { value } : { errors: error(`${EXTENSION_NAME}.valid`) };
  },
  messages: {
    [`${EXTENSION_NAME}.valid`]: "{{#label}} needs to be a valid semver range",
  },
});
