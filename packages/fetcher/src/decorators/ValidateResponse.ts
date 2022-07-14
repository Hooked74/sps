import { Schema } from "@h74-sps/validation";
import { AxiosRequestConfig } from "axios";

export const ValidateResponse =
  (validationSchema: Schema) =>
  (target: object, propertyKey: string, descriptor: PropertyDescriptor) => {
    const argTypes = Reflect.getMetadata("design:paramtypes", target, propertyKey);
    const configIndex = argTypes?.findIndex((argType: any) => argType === AxiosRequestConfig) ?? -1;

    return ~configIndex
      ? {
          ...descriptor,
          value(...args: any[]) {
            const config: AxiosRequestConfig = args[configIndex] ?? {};
            config.validationSchema = validationSchema;
            args.splice(configIndex, 1, config);

            return descriptor.value.apply(this, args);
          },
        }
      : descriptor;
  };
