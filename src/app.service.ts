import { Injectable } from '@nestjs/common';
import axios from 'axios';
// import * as PDFDocument from 'pdfkit';
import PDFDocument from 'pdfkit-table';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getpdf() {
    const pdfBuffer: Buffer = await new Promise(async (resolve) => {
      const doc = new PDFDocument({
        size: 'A4',
        bufferPages: true,
        margin: 35,
      });

      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .fillColor('#874563')
        .text('GSCS International LTD.', { align: 'center' });
      // doc.moveDown();
      doc
        .font('Helvetica')
        .fontSize(8)
        // .fillColor('black')
        .text('Rokeya Palace,H # 75, R # 11, Uttara 1230', { align: 'center' });
      doc.moveDown();
      doc
        .font('Helvetica-Bold')
        .fontSize(10)
        .fillColor('black')
        .text('Attendance report for the month of 2024-01-15 to 2024-02-15', {
          align: 'center',
        });
      // doc.moveDown();
      doc
        .font('Helvetica')
        .fontSize(6)
        .text(
          'DOM : Day of Month, DOJ : Date of Joining, WD : Working day,  NOH : No of Holiday, NOWD : No of Weekend Day, SL : Sick Leave, CL : Casual Leave, EL : ..... Leave, AWD : Actual Working Day, TDFW : Total Days For Wage',
          { align: 'justify' },
        );

      doc.moveDown();

      const tableData = {
        headers: [
          'SL',
          'Name',
          'ID No',
          'DOJ',
          'DOM',
          'WD',
          'NOH',
          'NOWD',
          'CL',
          'EL-MY',
          'PL-Pay',
          'SL',
          'W/O-Pay',
          'Absent',
          'Late',
          'AWD',
          'EL',
          'Wage',
          'TDFW',
          'Remarks',
        ],
        rows: [],
      };

      const params = {
        startDate: '2024-01-15',
        endDate: '2024-02-15',
      };

      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNkYjY2YjU1LTUyMDMtNGVjMi05MzQ3LTlkOGNlODcxZTkxNiIsInN0YXR1cyI6MSwiZnVsbF9uYW1lIjoiRmFoYWQgSGltZWwiLCJwaG90byI6IklNR18yMDI0MDEwMl8xMTAxNDQtcmVtb3ZlYmdfXzNfLVBob3RvUm9vbV8xNzA0NTEyNDA3MTAxLnBuZyIsImVtYWlsIjoiZmFoYWRoaW1lbEBnbWFpbC5jb20iLCJwaG9uZV9udW1iZXIiOiIwMTc1MzY0ODI1NiIsImlzX2FjdGl2ZSI6MSwiaXNfYWRtaW4iOjAsInVzZXJfcm9sZXNfaW5mbyI6W3siaWQiOiIwZGY4MGQyZC00MDFmLTRiYTUtYjg0Yy04NTQ3ZDYyM2I0M2MiLCJyb2xlc19pbmZvIjp7ImlkIjoiMmY2ZjFlZTYtNjM4Mi00ZmJjLThjOTQtYjdlYjlhZGQwMWU2IiwibmFtZSI6Imd1ZXN0In19LHsiaWQiOiIzZjU5Y2I0Yy0xZGYxLTQ0MmYtYTE1ZS1iOTZhNGQ4ZTI3MTAiLCJyb2xlc19pbmZvIjp7ImlkIjoiM2NmYTM0M2YtYjYzZS00Nzk2LTljZWYtMTM2N2JiN2FmOGI2IiwibmFtZSI6InN1cGVyX2FkbWluIn19LHsiaWQiOiI3OTA1ZTUyNy0wMTI1LTQ2ZTEtYTllMS00ZTYwYjJkOTVkMjYiLCJyb2xlc19pbmZvIjp7ImlkIjoiYWZkZTQwZTktYzM2ZS00MWVmLTk2NDItMDA5OWZkNTUzZGMwIiwibmFtZSI6InNwZWNpYWxfc3VwZXJfYWRtaW4ifX1dLCJyb2xlX2lkIjoiYWZkZTQwZTktYzM2ZS00MWVmLTk2NDItMDA5OWZkNTUzZGMwIiwicm9sZV9uYW1lIjoic3BlY2lhbF9zdXBlcl9hZG1pbiIsImlhdCI6MTcwNzEyOTU4NSwiZXhwIjoxNzA5NzIxNTg1fQ.XbLHzfJ241DSToGeVT1iOYgxVorWvhLWdRr6YyzII8s';

      try {
        const res = await axios.get(
          'http://localhost:8001/api/admin/report/users-attendance-Report',
          {
            params,
            headers: {
              Authorization: `Bearer ${token}`,
              // Add other headers if needed
            },
          },
        );
        const { attandence_report } = res.data.payload;

        attandence_report.forEach((report, index) => {
          // Access properties of each report object
          // console.log('Report:', report);

          tableData.rows.push([
            index + 1,
            report.full_name,
            report.office_id,
            report.date_of_joining.split('T')[0],
            report.day_of_start_end_date,
            report.Working_day,
            report.no_of_holiday,
            report.no_of_weekend_day,
            report.leave_info[0].days_count,
            report.leave_info[1].days_count,
            report.leave_info[2].days_count,
            report.leave_info[3].days_count,
            report.w_o_pay,
            report.absent,
            report.late,
            report.actual_Working_day,
            report.late_deduct['EL'],
            report.late_deduct['Wage'],
            report.total_days_for_wage,
            report.remarks,
          ]);
        });
      } catch (error) {
        console.log('Error:', error);
      }

      // Draw the table
      doc.table(tableData, {
        columnSpacing: 5,
        padding: [5],
        columnsSize: [
          25, 80, 40, 40, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 40,
        ],
        // align: 'center',
        prepareHeader: () => doc.fontSize(5),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          const { x, y, width, height } = rectCell;

          // Draw vertical lines for each cell
          if (indexColumn === 0) {
            doc
              .lineWidth(0.5)
              .moveTo(x, y)
              .lineTo(x, y + height)
              .stroke();
          }

          doc
            .lineWidth(0.5)
            .moveTo(x + width, y)
            .lineTo(x + width, y + height)
            .stroke();

          // Set font size and color
          doc.fontSize(5).fillColor('#292929');

          // Ensure to return the document instance
          return doc;
        },
      });

      // End the document
      doc.end();
      const buffer = [];
      doc.on('data', buffer.push.bind(buffer));
      doc.on('end', () => {
        const data = Buffer.concat(buffer);
        resolve(data);
      });
    });

    return pdfBuffer;
  }

  async getDetailsPdf() {
    try {
      const pdfBuffer: Buffer = await new Promise(async (resolve) => {
        const doc = new PDFDocument({
          size: 'A4',
          bufferPages: true,
          margin: 50,
        });

        /////////////////////////////////////////////////////////////////////////
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
        };

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
            ]);
          },
        );

        /////////////////////////////////////////////////////////////////////////
        doc.image('images/bg.png', 275, 30, { width: 50 });
        doc.moveDown();
        doc.moveDown();
        doc
          .font('Helvetica-Bold')
          .fontSize(10)
          .fillColor('#874563')
          .text('GSCS International LTD.', { align: 'center' });
        // doc.moveDown();
        doc
          .font('Helvetica')
          .fontSize(6)
          // .fillColor('black')
          .text('Rokeya Palace,H # 75, R # 11, Uttara 1230', {
            align: 'center',
          });
        doc.moveDown();
        doc
          .font('Helvetica-Bold')
          .fillColor('black')
          .fontSize(7)
          .text(`Employee Name: ${attandence_report_details.full_name} `, {
            align: 'justify',
          });
        doc
          .font('Helvetica-Bold')
          .fontSize(7)
          .text(`Office ID: ${attandence_report_details.office_id}`, {
            align: 'justify',
          });
        doc
          .font('Helvetica-Bold')
          .fontSize(7)
          .fillColor('black')
          .text(
            'Attendance Employee report Details for the 2024-01-15 to 2024-02-15',
            {
              align: 'center',
            },
          );
        // doc.moveDown();
        doc
          .font('Helvetica-Bold')
          .fontSize(6)
          .text(
            `Report Total Days: ${attandence_report_details.total_day}, User Attendance: ${attandence_report_details.attendance}, Late Attendance: ${attandence_report_details.late}, Absent: ${attandence_report_details.absent}, Weekend: ${attandence_report_details.weekend}, Holiday: ${attandence_report_details.holiday}, Total Leave: ${attandence_report_details.leave_day}`,
            {
              align: 'center',
            },
          );
        doc.font('Helvetica');

        doc.moveDown();

        // Draw the table
        doc.table(tableData, {
          columnSpacing: 5,
          padding: [5],
          columnsSize: [50, 60, 60, 60, 60, 60, 48, 48, 48],
          // align: 'center',
          prepareHeader: () => doc.fontSize(5),
          prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
            const { x, y, width, height } = rectCell;

            // Draw vertical lines for each cell
            if (indexColumn === 0) {
              doc
                .lineWidth(0.5)
                .moveTo(x, y)
                .lineTo(x, y + height)
                .stroke();
            }

            doc
              .lineWidth(0.5)
              .moveTo(x + width, y)
              .lineTo(x + width, y + height)
              .stroke();

            // Set font size and color
            doc.fontSize(5).fillColor('#292929');

            // Ensure to return the document instance
            return doc;
          },
        });

        // End the document
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
