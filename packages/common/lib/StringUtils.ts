export default {
    /**
     * Interpolate JS string at runtime with selected context.
     *
     * Original code taken from `mikemaccana/dynamic-template`.
     */
    interpolate: function(templateString: string, templateVars: any) {
        return templateString.replace(/\${(.*?)}/g, (_, g) => templateVars[g]);
    }
}
