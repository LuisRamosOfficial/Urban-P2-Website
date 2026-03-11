

// Function where it takes a string and makes the first letter uppercase and the rest lowercase
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}