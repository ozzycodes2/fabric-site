export const variantScript = `try{var v=localStorage.getItem("fabric-variant");if(v==="dusk"||v==="dawn")document.documentElement.setAttribute("data-variant",v)}catch(e){}`;

// Runs synchronously in <head> so the stored variant is on <html> before first paint.
export function VariantScript() {
  return <script dangerouslySetInnerHTML={{ __html: variantScript }} />;
}
