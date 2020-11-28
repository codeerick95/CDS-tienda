export const precio = {
    methods: {
        formatoAPrecio(n, sep, decimals) {
            sep = sep || "."; // Default to period as decimal separator
            decimals = decimals || 2; // Default to 2 decimals

            return (
                n.toLocaleString().split(sep)[0] +
                sep +
                n.toFixed(decimals).split(sep)[1]
            );
        }
    }
}