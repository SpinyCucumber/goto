const canvas = document.createElement('canvas');

export function getCanvasFont(styles: CSSStyleDeclaration): string {
    const weight = styles.getPropertyValue('font-weight');
    const size = styles.getPropertyValue('font-size');
    const family = styles.getPropertyValue('font-family');
    return `${weight} ${size} ${family}`;
}

export function measureWidth(text: string, font: string): number {
    const context = canvas.getContext('2d')!;
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}