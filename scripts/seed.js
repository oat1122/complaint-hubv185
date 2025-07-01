const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@oat.com' },
    update: {},
    create: {
      email: 'admin@oat.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create viewer user
  const viewerPassword = await bcrypt.hash('Pna123', 10);
  const viewer = await prisma.user.upsert({
    where: { email: 'Pna@example.com' },
    update: {},
    create: {
      email: 'Pna@example.com',
      password: viewerPassword,
      role: 'VIEWER',
    },
  });

  console.log('✅ Users created:', { admin: admin.email, viewer: viewer.email });

  // Create sample complaints with new enum values
  const sampleComplaints = [
    {
      title: 'ระบบคอมพิวเตอร์ทำงานช้า',
      description: 'เครื่องคอมพิวเตอร์ในสำนักงานทำงานช้ามาก โปรแกรมค้าง บางครั้งหน่วงมากจนทำงานไม่ได้',
      category: 'TECHNICAL',
      priority: 'HIGH',
      status: 'NEW',
    },
    {
      title: 'พนักงานให้บริการไม่ดี',
      description: 'พนักงานที่เคาน์เตอร์บริการพูดจาไม่สุภาพ ไม่ช่วยเหลือลูกค้า ทำให้รู้สึกไม่พอใจ',
      category: 'PERSONNEL',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
    },
    {
      title: 'ห้องน้ำไม่สะอาด',
      description: 'ห้องน้ำในอาคารสกปรก ไม่มีสบู่ ไม่มีกระดาษทิชชู่ กลิ่นไม่ดี',
      category: 'ENVIRONMENT',
      priority: 'MEDIUM',
      status: 'RESOLVED',
    },
    {
      title: 'เครื่องปรินเตอร์เสีย',
      description: 'เครื่องปรินเตอร์ในแผนกพิมพ์เอกสารไม่ได้ มีข้อความแสดงข้อผิดพลาด ต้องการซ่อมแซม',
      category: 'EQUIPMENT',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    },
    {
      title: 'พื้นลื่นในบริเวณทางเดิน',
      description: 'พื้นในบริเวณทางเดินชั้น 2 ลื่นมาก เสี่ยงต่อการล้มและอุบัติเหตุ ต้องการแก้ไขด่วน',
      category: 'SAFETY',
      priority: 'URGENT',
      status: 'NEW',
    },
    {
      title: 'การเบิกจ่ายงบประมาณล่าช้า',
      description: 'การอนุมัติงบประมาณและการเบิกจ่ายใช้เวลานานเกินไป ส่งผลต่อการดำเนินงาน',
      category: 'FINANCIAL',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
    },
    {
      title: 'ขั้นตอนการอนุมัติเอกสารซับซ้อน',
      description: 'ขั้นตอนการอนุมัติเอกสารมีหลายขั้นตอนที่ซับซ้อน ใช้เวลานาน ต้องการปรับปรุงระบบ',
      category: 'STRUCTURE_SYSTEM',
      priority: 'MEDIUM',
      status: 'NEW',
    },
    {
      title: 'ประกันสังคมไม่ครอบคลุม',
      description: 'ประกันสังคมไม่ครอบคลุมการรักษาบางประเภท พนักงานต้องจ่ายค่ารักษาเพิ่ม',
      category: 'WELFARE_SERVICES',
      priority: 'LOW',
      status: 'RESOLVED',
    },
    {
      title: 'เสนอระบบการทำงานแบบ Hybrid',
      description: 'เสนอให้มีระบบการทำงานแบบ Hybrid ทำงานที่บ้านและที่สำนักงานสลับกัน เพื่อเพิ่มประสิทธิภาพ',
      category: 'PROJECT_IDEA',
      priority: 'LOW',
      status: 'NEW',
    },
    {
      title: 'ขอให้เพิ่มช่องทางการติดต่อ',
      description: 'ขอให้เพิ่มช่องทางการติดต่อผ่าน Line หรือ Chat bot เพื่อความสะดวกในการสอบถาม',
      category: 'OTHER',
      priority: 'LOW',
      status: 'CLOSED',
    }
  ];

  for (const complaint of sampleComplaints) {
    const trackingId = `TRK-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
    
    await prisma.complaint.create({
      data: {
        ...complaint,
        trackingId,
      },
    });
  }

  console.log('✅ Sample complaints created');
  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
