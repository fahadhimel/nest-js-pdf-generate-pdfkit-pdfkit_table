import { Injectable } from '@nestjs/common';
import axios from 'axios';
// import * as PDFDocument from 'pdfkit';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const PDFDocument = require('pdfkit-table');

@Injectable()
export class AppService2 {
  getHello(): string {
    return 'Hello World!';
  }

  async testColorPDF2() {
    try {
      const pdfBuffer: Buffer = await new Promise(async (resolve) => {
        const doc = new PDFDocument({
          size: 'A3',
          bufferPages: true,
          margin: 35,
        });

        const tableData = {
          headers: [
            'SL',
            'Date',
            'Day',
            'In Time',
            'Out Time',
            'Day Type',
            'Leave day',
            'Holiday',
            'Weekend',
          ],
          rows: [],
        };

        const params = {
          user_id: '8722d06a-e334-4450-9793-27ac9578f6a2',
          startDate: '2024-01-15',
          endDate: '2024-02-15',
        }; // Access properties of each report object
        // console.log('Report:', report);

        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNkYjY2YjU1LTUyMDMtNGVjMi05MzQ3LTlkOGNlODcxZTkxNiIsInN0YXR1cyI6MSwiZnVsbF9uYW1lIjoiRmFoYWQgSGltZWwiLCJwaG90byI6IklNR18yMDI0MDEwMl8xMTAxNDQtcmVtb3ZlYmdfXzNfLVBob3RvUm9vbV8xNzA0NTEyNDA3MTAxLnBuZyIsImVtYWlsIjoiZmFoYWRoaW1lbEBnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTc1MzY0ODI1NiIsImlzX2FjdGl2ZSI6MSwiaXNfYWRtaW4iOjAsInVzZXJfcm9sZXNfaW5mbyI6W3siaWQiOiIwZGY4MGQyZC00MDFmLTRiYTUtYjg0Yy04NTQ3ZDYyM2I0M2MiLCJyb2xlc19pbmZvIjp7ImlkIjoiMmY2ZjFlZTYtNjM4Mi00ZmJjLThjOTQtYjdlYjlhZGQwMWU2IiwibmFtZSI6Imd1ZXN0In19LHsiaWQiOiIzZjU5Y2I0Yy0xZGYxLTQ0MmYtYTE1ZS1iOTZhNGQ4ZTI3MTAiLCJyb2xlc19pbmZvIjp7ImlkIjoiM2NmYTM0M2YtYjYzZS00Nzk2LTljZWYtMTM2N2JiN2FmOGI2IiwibmFtZSI6InN1cGVyX2FkbWluIn19LHsiaWQiOiI3OTA1ZTUyNy0wMTI1LTQ2ZTEtYTllMS00ZTYwYjJkOTVkMjYiLCJyb2xlc19pbmZvIjp7ImlkIjoiYWZkZTQwZTktYzM2ZS00MWVmLTk2NDItMDA5OWZkNTUzZGMwIiwibmFtZSI6InNwZWNpYWxfc3VwZXJfYWRtaW4ifX1dLCJyb2xlX2lkIjoiYWZkZTQwZTktYzM2ZS00MWVmLTk2NDItMDA5OWZkNTUzZGMwIiwicm9sZV9uYW1lIjoic3BlY2lhbF9zdXBlcl9hZG1pbiIsImlhdCI6MTcwNzEyOTU4NSwiZXhwIjoxNzA5NzIxNTg1fQ.XbLHzfJ241DSToGeVT1iOYgxVorWvhLWdRr6YyzII8s';

        const res = await axios.get(
          'http://localhost:8001/api/admin/report/attandence-report/details',
          {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
              // Add other headers if needed
            },
          },
        );
        const { attandence_report_details } = res.data.payload;
        // console.log('first', attandence_report_details);

        attandence_report_details.user_start_end_date_info.forEach(
          (report, index) => {
            // Access properties of each report object
            // console.log('Report:', report);

            tableData.rows.push([
              index + 1,
              report.date,
              report.day,
              report.start_time,
              report.end_time,
              report.day_type,
              report.leaveday,
              report.holiday,
              report.weekend,
              '11',
              '22',
            ]);
          },
        );

        const columnSpacing = [30, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50];
        let y = 70;
        const height = 15;
        const Hheight = 30;

        const headers = [
          'SL',
          'Date',
          'Day',
          [['leaves'], ['In Time', 'Out Time', 'Day Type']],
          'Leave day',
          'Holiday',
          [['anys'], ['h1', 'h2']],
          'Weekend',
        ];
        let x = columnSpacing[0];
        ////////////////////////////////////////////////
        // y += 30;
        // header section
        for (let i = 0; i < headers.length; i++) {
          let width = columnSpacing[i];
          if (typeof headers[i][0] == 'object') {
            const hpading = columnSpacing.slice(i, headers[i][1].length + i);
            const sum = hpading.reduce(function (acc, cur) {
              return acc + cur;
            }, 0);

            const cellText = String(headers[i][0][0]);

            const centerX = x + sum / 2;
            const centerY = y - (Hheight / 4) * 3;

            const textWidth = doc.widthOfString(cellText);
            const textHeight = doc.currentLineHeight();
            const adjustedX = centerX - textWidth / 2;
            const adjustedY = centerY - textHeight / 2;

            doc.font('Helvetica').fontSize(6).fillColor('black').text(
              headers[i][0][0],
              adjustedX,
              adjustedY,
              // x + (sum / 2 - headers[i][0][0].length),
              // y - Hheight + 2.5,
            );

            for (let k = 0; k < headers[i][1].length; k++) {
              width = columnSpacing[i + k];

              const cellText = String(headers[i][1][k]);

              const centerX = x + width / 2;
              const centerY = y - Hheight / 4;

              const textWidth = doc.widthOfString(cellText);
              const textHeight = doc.currentLineHeight();
              const adjustedX = centerX - textWidth / 2;
              const adjustedY = centerY - textHeight / 2;

              doc
                .lineWidth(0.1)
                .moveTo(x + width, y - Hheight)
                .lineTo(x, y - Hheight)
                .stroke();

              doc
                .lineWidth(0.1)
                .moveTo(x + width, y - Hheight / 2)
                .lineTo(x + width, y)
                .stroke();

              doc
                .font('Helvetica')
                .fontSize(6)
                .fillColor('black')
                .text(cellText, adjustedX, adjustedY);

              doc
                .lineWidth(0.1)
                .moveTo(x, y - Hheight / 2)
                .lineTo(width + x, y - Hheight / 2)
                .stroke();

              doc
                .lineWidth(0.1)
                .moveTo(x, y)
                .lineTo(width + x, y)
                .stroke();

              x += width;
            }
          } else {
            const cellText = String(tableData.headers[i]);

            const centerX = x + width / 2;
            const centerY = y - Hheight / 2;

            const textWidth = doc.widthOfString(cellText);
            const textHeight = doc.currentLineHeight();
            const adjustedX = centerX - textWidth / 2;
            const adjustedY = centerY - textHeight / 2;

            doc
              .lineWidth(0.1)
              .moveTo(x, y - Hheight)
              .lineTo(x, y)
              .stroke();
            doc
              .font('Helvetica')
              .fontSize(6)
              .fillColor('black')
              .text(cellText, adjustedX, adjustedY);
            console.log(cellText, adjustedX, adjustedY);
            doc
              .lineWidth(0.1)
              .moveTo(x + width, y - Hheight)
              .lineTo(x + width, y)
              .stroke();

            doc
              .lineWidth(0.1)
              .moveTo(x, y - Hheight)
              .lineTo(width + x, y - Hheight)
              .stroke();

            doc
              .lineWidth(0.1)
              .moveTo(x, y)
              .lineTo(width + x, y)
              .stroke();

            x += width;
          }
        }
        ////////////////////////////////////////////////
        // y += 40;
        for (let i = 0; i < tableData.rows.length; i++) {
          let x = columnSpacing[0];
          for (let j = 0; j < columnSpacing.length; j++) {
            const width = columnSpacing[j];
            const cellText = String(tableData.rows[i][j]);

            const centerX = x + width / 2;
            const centerY = y + height / 2;

            doc
              .lineWidth(0.1)
              .moveTo(x, y)
              .lineTo(x, y + height)
              .stroke();

            if (cellText.length) {
              const textWidth = doc.widthOfString(cellText);
              const textHeight = doc.currentLineHeight();
              const adjustedX = centerX - textWidth / 2;
              const adjustedY = centerY - textHeight / 2;

              doc
                .font('Helvetica')
                .fontSize(6)
                .fillColor('black')
                .text(cellText, adjustedX, adjustedY);
            }

            doc
              .lineWidth(0.1)
              .moveTo(x + width, y)
              .lineTo(x + width, y + height)
              .stroke();

            doc
              .lineWidth(0.1)
              .moveTo(x, y)
              .lineTo(width + x, y)
              .stroke();

            doc
              .lineWidth(0.1)
              .moveTo(x, y + height)
              .lineTo(width + x, y + height)
              .stroke();

            x += columnSpacing[j];
          }
          y += height;
        }

        // // done!
        doc.end();
        const buffer = [];
        doc.on('data', buffer.push.bind(buffer));
        doc.on('end', () => {
          const data = Buffer.concat(buffer);
          resolve(data);
        });
      });
      return pdfBuffer;
    } catch (error) {
      throw error;
    }
  }
}

// const columnSpacing = [30, 80, 80, 80, 80, 80, 20, 20, 20];
//         let y = 70;
//         const height = 15;

//         for (let i = 0; i < tableData.rows.length; i++) {
//           let x = columnSpacing[0];
//           for (let j = 0; j < columnSpacing.length; j++) {
//             const width = columnSpacing[j];
//             doc
//               .lineWidth(0.1)
//               .moveTo(x, y)
//               .lineTo(x, y + height)
//               .stroke();
//             doc
//               .font('Helvetica')
//               .fontSize(6)
//               .fillColor('black')
//               .text(tableData.rows[i][j], x + 5, y + 5);
//             doc
//               .lineWidth(0.1)
//               .moveTo(x + width, y)
//               .lineTo(x + width, y + height)
//               .stroke();

//             doc
//               .lineWidth(0.1)
//               .moveTo(x, y)
//               .lineTo(width + x, y)
//               .stroke();

//             doc
//               .lineWidth(0.1)
//               .moveTo(x, y + height)
//               .lineTo(width + x, y + height)
//               .stroke();

//             x += columnSpacing[j];
//           }
//           y += height;
//         }

/*
for (let i = 0; i < tableData.rows.length; i++) {
          let x = columnSpacing[0];
          for (let j = 0; j < columnSpacing.length; j++) {
            const width = columnSpacing[j];
            const cellText = tableData.rows[i][j];

            const centerX = x + width / 2;
            const centerY = y + height / 2;

            console.log(
              'tableData.rows[i][j].length',
              tableData.rows[i][j].length,
              tableData.rows[i][j],
            );

            doc
              .lineWidth(0.1)
              .moveTo(x, y)
              .lineTo(x, y + height)
              .stroke();

            if (cellText.length) {
              const textWidth = doc.widthOfString(cellText);
              const textHeight = doc.currentLineHeight();
              const adjustedX = centerX - textWidth / 2;
              const adjustedY = centerY - textHeight / 2;

              doc
                .font('Helvetica')
                .fontSize(6)
                .fillColor('black')
                .text(cellText, adjustedX, adjustedY);
            }

            doc
              .lineWidth(0.1)
              .moveTo(x + width, y)
              .lineTo(x + width, y + height)
              .stroke();

            doc
              .lineWidth(0.1)
              .moveTo(x, y)
              .lineTo(width + x, y)
              .stroke();

            doc
              .lineWidth(0.1)
              .moveTo(x, y + height)
              .lineTo(width + x, y + height)
              .stroke();

            x += columnSpacing[j];
          }
          y += height;
        }
*/
