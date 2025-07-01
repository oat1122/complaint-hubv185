import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { pdf, Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import ExcelJS from 'exceljs';

function getStartDate(range: string) {
  const date = new Date();
  switch (range) {
    case '1month':
      date.setMonth(date.getMonth() - 1);
      break;
    case '3months':
      date.setMonth(date.getMonth() - 3);
      break;
    case '6months':
      date.setMonth(date.getMonth() - 6);
      break;
    case '1year':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setMonth(date.getMonth() - 6);
  }
  return date;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'ADMIN' && session.user.role !== 'VIEWER')) {
      return NextResponse.json({ error: 'ไม่ได้รับอนุญาต' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'pdf';
    const timeRange = searchParams.get('timeRange') || '6months';

    const startDate = getStartDate(timeRange);

    const stats = await prisma.complaint.groupBy({
      by: ['category'],
      _count: { id: true },
      where: { createdAt: { gte: startDate } },
      orderBy: { _count: { id: 'desc' } }
    });

    if (format === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Analytics');
      sheet.columns = [
        { header: 'Category', key: 'category' },
        { header: 'Count', key: 'count' }
      ];
      stats.forEach((s) => {
        sheet.addRow({ category: s.category, count: s._count.id });
      });
      const buffer = await workbook.xlsx.writeBuffer();
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type':
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="analytics.xlsx"'
        }
      });
    }

    const styles = StyleSheet.create({
      page: { padding: 30 },
      title: { fontSize: 18, marginBottom: 10 },
      item: { fontSize: 12, marginBottom: 4 }
    });

    const doc = (
      <Document>
        <Page style={styles.page}>
          <Text style={styles.title}>Analytics Export ({timeRange})</Text>
          {stats.map((s) => (
            <Text key={s.category} style={styles.item}>
              {s.category}: {s._count.id}
            </Text>
          ))}
        </Page>
      </Document>
    );

    const buffer = await pdf(doc).toBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="analytics.pdf"'
      }
    });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    return NextResponse.json({ error: 'เกิดข้อผิดพลาดในการส่งออก' }, { status: 500 });
  }
}
