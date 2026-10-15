export declare class UploadsController {
    uploadSingleFile(file: any): {
        url: string;
        filename: any;
        originalName: any;
        mimetype: any;
        size: any;
    };
    uploadMultipleFiles(files: any[]): {
        url: string;
        filename: any;
        originalName: any;
        mimetype: any;
        size: any;
    }[];
}
