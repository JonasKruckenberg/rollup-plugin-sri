import { RollupBuild, OutputAsset, OutputOptions } from "rollup";

export async function getHtml(bundle: RollupBuild, outputOptions?: OutputOptions): Promise<{ fileName: string; source: string | Uint8Array }>
export async function getHtml(bundle: RollupBuild, outputOptions: OutputOptions, allFiles: true): Promise<{ fileName: string; source: string | Uint8Array }[]>
export async function getHtml(bundle: RollupBuild, outputOptions?: OutputOptions, allFiles = false) {    
    const { output } = await bundle.generate(outputOptions || { format: 'esm', exports: 'auto' });
    
    const files = output
        .filter((file): file is OutputAsset => file.type === 'asset' && file.fileName.endsWith('.html'))
        .map(({ fileName, source }) => ({ fileName, source }))
    
    return allFiles ? files : files[0]
}

export function emitAsset(fileName:string, source: string) {
    return {
        name: 'emit-test-asset',
        buildStart() {
            this.emitFile({
                type: 'asset',
                fileName,
                source
            })
        }
    }
}