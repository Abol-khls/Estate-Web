import {
    PROPERTY_TYPES,
    TRANSACTION_TYPES
} from "./propertyOptions";

export function getPropertyTypeLabel(value) {
    return (
        PROPERTY_TYPES.find(item => item.value === value)?.label ??
        value
    );
}

export function getTransactionTypeLabel(value) {
    return (
        TRANSACTION_TYPES.find(item => item.value === value)?.label ??
        value
    );
}