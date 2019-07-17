import { classToPlain, plainToClass } from "class-transformer";
import { ClassType } from "class-transformer/ClassTransformer";
import { validateSync, ValidatorOptions } from "class-validator";
import { Dictionary, forIn, map, reduce, first, cloneDeep, isString, union } from "lodash";

export interface IValidatable {
    __validatorOptions: ValidatorOptions;
    __errors: Dictionary<string[]>;
    __defaultGroup: string;

    validate(groups?: string | string[]): void;
    errors(groups?: string | string[]): string[];
    hasErrors(groups?: string | string[]): boolean;
    errorFor(name: keyof this, groups?: string | string[]): string;
    errorsFor(name: keyof this, groups?: string | string[]): string[];
    hasErrorsFor(name: keyof this, groups?: string | string[]): boolean;
}
export type ValidatableClass<T> = ClassType<IValidatable> & T;

export const Validatable = <T extends ClassType<any>>(Base: T): ValidatableClass<T> => {
    return class extends Base implements IValidatable {
        public __validatorOptions: ValidatorOptions = { skipMissingProperties: false };
        public __errors: { [key in keyof this]?: string[] } = {};
        public __defaultGroup = "all";

        public validate(groups?: string | string[]) {
            forIn(this, (v, k: keyof this) => {
                if (typeof (v) !== "function") this.__errors[k] = [];
            });

            validateSync(this, this.getValidatorOptions(groups))
                .forEach(({ property, constraints }) => this.__errors[property as keyof this] = map(constraints, v => v))
        }

        public hasErrors(groups?: string | string[]): boolean {
            this.validate(groups);
            return reduce<Dictionary<string[]>, number>(this.__errors, (s, errors) => s += errors.length, 0) > 0;
        }

        public errorsFor(name: keyof this, groups?: string | string[]): string[] {
            this.validate(groups);
            return this.__errors[name] || [];
        }

        public errorFor(name: keyof this, groups?: string | string[]): string {
            return first(this.errorsFor(name, groups));
        }

        public errors(groups?: string | string[]): string[] {
            this.validate(groups);
            return reduce(this.__errors, (errors, current) => [...errors, ...current]);
        }

        public hasErrorsFor(name: keyof this, groups?: string | string[]): boolean {
            return this.errorsFor(name, groups).length > 0;
        }

        private getValidatorOptions(groups: string | string[]): ValidatorOptions {
            if (!groups) {
                groups = this.__defaultGroup;
            }

            let vo: ValidatorOptions = cloneDeep(this.__validatorOptions);
            if (isString(groups)) {
                groups = [groups];
            }
            vo.groups = union(vo.groups, groups);

            return vo;
        }

    };

};

export class Class { }

export function FromPlain<T>(Base: ClassType<T>, plain: any): ValidatableClass<T> {
    return plainToClass<any, ValidatableClass<T>>(Base, plain);
}

export function ToPlain<T>(plain: ValidatableClass<T>): T {
    return classToPlain(plain, { excludePrefixes: ["__validatorOptions", "__errors", "__defaultGroup"] }) as T;
}
