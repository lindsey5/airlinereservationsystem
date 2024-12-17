export default function formatPrice(price) {
    return !price ? '' :  `₱ ${price.toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    })}`;
}