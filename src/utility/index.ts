const canvas = document.createElement('canvas');

function getCanvasFont(styles: CSSStyleDeclaration): string {
    const weight = styles.getPropertyValue('font-weight');
    const size = styles.getPropertyValue('font-size');
    const family = styles.getPropertyValue('font-family');
    return `${weight} ${size} ${family}`;
}

function measureWidth(text: string, font: string): number {
    const context = canvas.getContext('2d')!;
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

export { getCanvasFont, measureWidth }