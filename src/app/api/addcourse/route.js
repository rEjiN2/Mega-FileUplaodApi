import connect from "@/utils/db";
import { NextResponse } from "next/server";
import Courses from "@/models/Courses";
import { Storage } from 'megajs';
import {writeFile,mkdir} from 'fs/promises'
import {join,dirname} from 'path'
import { Readable } from "stream";


export const POST = async(request) => {
    try {
        const CourseData = await request.formData();
        const file = CourseData.get('image');
           console.log(file);
        await connect();
        const bytes = await file.arrayBuffer()
         const buffer = Buffer.from(bytes)

        const megaAccount = new Storage({
            email: process.env.MEGA_EMAIL,
            password: process.env.MEGA_PASSWORD
        });

        // Wait for the Mega account to be ready
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                if (megaAccount.root) {
                    resolve();
                } else {
                    reject(new Error('Mega account not ready'));
                }
            }, 10000); // Wait for 1 second. Adjust the time as necessary.
        });
              
        const stream = Readable.from(buffer);
        // Upload the file
        const uploadStream = megaAccount.upload({
            name: file.name,
            size: file.size, 
            target: megaAccount.root
        });

        const uploadedFile = await new Promise((resolve, reject) => {
            uploadStream.on('complete', file => resolve(file));
            uploadStream.on('error', reject);
            stream.pipe(uploadStream);
        });
        
        const fileLink = await new Promise((resolve, reject) => {
            uploadedFile.link((err, link) => {
                if (err) reject(err);
                else resolve(link);
            });
        });
        
        console.log(`Uploaded to Mega: ${uploadedFile.name}`);
        console.log(`File URL: ${fileLink}`);
        return new NextResponse(JSON.stringify(fileLink), { status: 201 });

    } catch (err) {
        console.log(err.message);
        return new NextResponse(JSON.stringify("Error"), { status: 500 });
    }
};
