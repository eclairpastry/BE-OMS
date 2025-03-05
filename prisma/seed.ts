import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
    // Create PERMISSIONS
    const permission1 = await prisma.permission.createMany({
        data: [
          {
            id: 1,
            name: 'Create Users',
            action: 'Create',
          },
          {
            id: 2,
            name: 'Read Users',
            action: 'Read'
          },
          {
            id: 3,
            name: 'Update Users',
            action: 'Update',
          },
          {
            id: 4,
            name: 'Delete Users',
            action: 'Delete',
          },
          {
            id: 5,
            name: 'Create Role',
            action: 'Create',
          },
          {
            id: 6,
            name: 'Read Role',
            action: 'Read'
          },
          {
            id: 7,
            name: 'Update Role',
            action: 'Update',
          },
          {
            id: 8,
            name: 'Delete Role',
            action: 'Delete',
          },
          {
            id: 9,
            name: 'Create Sub_Role',
            action: 'Create',
          },
          {
            id: 10,
            name: 'Read Sub_Role',
            action: 'Read'
          },
          {
            id: 11,
            name: 'Update Sub_Role',
            action: 'Update',
          },
          {
            id: 12,
            name: 'Delete Sub_Role',
            action: 'Delete',
          },
          {
            id: 13,
            name: 'Create Permission',
            action: 'Create',
          },
          {
            id: 14,
            name: 'Read Permission',
            action: 'Read'
          },
          {
            id: 15,
            name: 'Update Permission',
            action: 'Update',
          },
          {
            id: 16,
            name: 'Delete Permission',
            action: 'Delete',
          },
          {
            id: 17,
            name: 'Create Candidates',
            action: 'Create',
          },
          {
            id: 18,
            name: 'Read Candidates',
            action: 'Read'
          },
          {
            id: 19,
            name: 'Update Candidates',
            action: 'Update',
          },
          {
            id: 20,
            name: 'Delete Candidates',
            action: 'Delete',
          }
        ],
        skipDuplicates: true,
      });
      
    // Create ROLES
    const superAdminRole = await prisma.role.create({
        data: {
            name: 'Super Admin',
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 1
                        },
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                        {
                            permission_id: 4
                        },
                        {
                            permission_id: 5
                        },
                        {
                            permission_id: 6
                        },
                        {
                            permission_id: 7
                        },
                        {
                            permission_id: 8
                        },
                        {
                            permission_id: 9
                        },
                        {
                            permission_id: 10
                        },
                        {
                            permission_id: 11
                        },
                        {
                            permission_id: 12
                        },
                        {
                            permission_id: 13
                        },
                        {
                            permission_id: 14
                        },
                        {
                            permission_id: 15
                        },
                        {
                            permission_id: 16
                        },
                        {
                            permission_id: 17
                        },
                        {
                            permission_id: 18
                        },
                        {
                            permission_id: 19
                        },
                        {
                            permission_id: 20
                        }
                    ]
                }
            }
        }
    });

    const adminRole = await prisma.role.create({
        data: {
            name: 'Admin',
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 17
                        },
                        {
                            permission_id: 18
                        },
                        {
                            permission_id: 19
                        },
                        {
                            permission_id: 20
                        }
                    ]
                }
            }
        }
    });

    const bphRole = await prisma.role.create({
        data: {
            name: 'BPH',
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 1
                        },
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                        {
                            permission_id: 4
                        }
                    ]
                }
            }
        }
    });

    const phRole = await prisma.role.create({
        data: {
            name: 'PH',
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 1
                        },
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                        {
                            permission_id: 4
                        }
                    ]
                }
            }
        }
    });

    const dpoRole = await prisma.role.create({
        data: {
            name: 'DPO',
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 1
                        },
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                        {
                            permission_id: 4
                        }
                    ]
                }
            }
        }
    });

    const anggotaRole = await prisma.role.create({
        data: {
            name: 'Anggota',
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 2
                        },
                    ]
                }
            }
        }
    });

    const calonAnggotaRole = await prisma.role.create({
        data: {
            name: 'Calon Anggota',
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 2
                        },
                    ]
                }
            }
        }
    });
    
    const ketuaSubRole = await prisma.sub_Role.create({
        data: {
            name: 'Ketua',
            role: {
                connect: { id: bphRole.id }
            },
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 1
                        },
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                        {
                            permission_id: 4
                        }
                    ]
                }
            }
        }
    });

    const wakilketuaSubRole = await prisma.sub_Role.create({
        data: {
            name: 'Wakil Ketua',
            role: {
                connect: { id: bphRole.id }
            },
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 1
                        },
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                        {
                            permission_id: 4
                        }
                    ]
                }
            }
        }
    });

    const sekretarisSubRole = await prisma.sub_Role.create({
        data: {
            name: 'Sekretaris',
            role: {
                connect: { id: bphRole.id }
            },
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        }
                    ]
                }
            }
        }
    });

    const bendaharaSubRole = await prisma.sub_Role.create({
        data: {
            name: 'Bendahara',
            role: {
                connect: { id: bphRole.id }
            },
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        }
                    ]
                }
            }
        }
    });

    // 2. PH Subroles
    const keanggotaanSubRole = await prisma.sub_Role.create({
        data: {
            name: 'Keanggotaan',
            role: {
                connect: { id: phRole.id }
            },
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                    ]
                }
            }
        }
    });

    const pendidikanSubRole = await prisma.sub_Role.create({
        data: {
            name: 'Pendidikan',
            role: {
                connect: { id: phRole.id }
            },
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                    ]
                }
            }
        }
    });

    const minatdanbakatSubRole = await prisma.sub_Role.create({
        data: {
            name: 'Minat dan Bakat',
            role: {
                connect: { id: phRole.id }
            },
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                    ]
                }
            }
        }
    });

    const humasSubRole = await prisma.sub_Role.create({
        data: {
            name: 'Hubungan Masyarakat',
            role: {
                connect: { id: phRole.id }
            },
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                    ]
                }
            }
        }
    });

    const publikasiSubRole = await prisma.sub_Role.create({
        data: {
            name: 'Pubikasi',
            role: {
                connect: { id: phRole.id }
            },
            permissions: {
                createMany: {
                    data: [
                        {
                            permission_id: 2
                        },
                        {
                            permission_id: 3
                        },
                    ]
                }
            }
        }
    });

    // Create USERS
    const user1 = await prisma.users.create({
        data: {
          nra: '282/UKM_IK/XXVI/2021',
          nim: '205410048',
          role_id: superAdminRole.id,
          subrole_id: null,
          nama: 'Dian Setiawan',
          username: 'superadmin',
          email: 'superadmin@gmail.com',
          password: '$2a$10$.cSm8BpdO5/vym.dC1HC5.t6C8Yi9Upmp9InfAOQIYaIhN8T4fcs2',
          no_telp: '081328990001',
          jenis_kelamin: 'MALE',
          agama: 'Islam',
          image: 'superadmin.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user2 = await prisma.users.create({
        data: {
          nra: '327/UKM_IK/XXVII/2023',
          nim: '205410049',
          role_id: adminRole.id,
          subrole_id: null,
          nama: 'Yusseno',
          username: 'admin',
          email: 'admin@gmail.com',
          password: 'admin123',
          no_telp: '081328990002',
          jenis_kelamin: 'MALE',
          agama: 'Islam',
          image: 'admin.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user3 = await prisma.users.create({
        data: {
          nra: '291/UKM_IK/XXVI/2021',
          nim: '205410050',
          role_id: bphRole.id,
          subrole_id: ketuaSubRole.id,
          nama: 'King',
          username: 'ketua',
          email: 'ketua@gmail.com',
          password: 'ketua123',
          no_telp: '081328990003',
          jenis_kelamin: 'MALE',
          agama: 'Islam',
          image: 'ketua.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user4 = await prisma.users.create({
        data: {
          nra: '313/UKM_IK/XXVII/2023',
          nim: '215410027',
          role_id: bphRole.id,
          subrole_id: wakilketuaSubRole.id,
          nama: 'Muhammad Fattah',
          username: 'wakilketua',
          email: 'muhammad.fattah@students.utdi.ac.id',
          password: 'ketua123',
          no_telp: '081328990004',
          jenis_kelamin: 'MALE',
          agama: 'Islam',
          image: 'wakilketua.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user5 = await prisma.users.create({
        data: {
          nra: '322/UKM_IK/XXVII/2023',
          nim: '215410068',
          role_id: bphRole.id,
          subrole_id: bendaharaSubRole.id,
          nama: 'Lintang Anjar',
          username: 'bendahara',
          email: 'lintang.anjar@students.utdi.ac.id',
          password: 'bendahara123',
          no_telp: '081328990005',
          jenis_kelamin: 'FEMALE',
          agama: 'Islam',
          image: 'bendahara.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user6 = await prisma.users.create({
        data: {
          nra: '308/UKM_IK/XXVII/2023',
          nim: '215610052',
          role_id: bphRole.id,
          subrole_id: sekretarisSubRole.id,
          nama: 'Dwi Indah',
          username: 'sekretaris',
          email: 'dwi.indah@students.utdi.ac.id',
          password: 'sekretaris123',
          no_telp: '081328990006',
          jenis_kelamin: 'FEMALE',
          agama: 'Islam',
          image: 'sekretaris.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Sistem Informasi',
          status: 'Active',
        },
    });

    const user7 = await prisma.users.create({
        data: {
          nra: '305/UKM_IK/XXVII/2023',
          nim: '215410043',
          role_id: phRole.id,
          subrole_id: keanggotaanSubRole.id,
          nama: 'Tri Nugroho',
          username: 'Keanggotaan',
          email: 'tri.nugroho@students.utdi.ac.id',
          password: 'keanggotaan123',
          no_telp: '081328990007',
          jenis_kelamin: 'MALE',
          agama: 'Kristen',
          image: 'keanggotaan.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user8 = await prisma.users.create({
        data: {
          nra: '303/UKM_IK/XXVII/2023',
          nim: '215410002',
          role_id: phRole.id,
          subrole_id: pendidikanSubRole.id,
          nama: 'Baihaqi Asshiddiqie',
          username: 'pendidikan',
          email: 'baihaqi.asshidiqie@students.utdi.ac.id',
          password: 'pendidikan123',
          no_telp: '081328990008',
          jenis_kelamin: 'MALE',
          agama: 'Islam',
          image: 'pendidikan.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user9 = await prisma.users.create({
        data: {
          nra: '325/UKM_IK/XXVII/2023',
          nim: '215410001',
          role_id: phRole.id,
          subrole_id: minatdanbakatSubRole.id,
          nama: 'Micel Yizrel',
          username: 'minatbakat',
          email: 'micel.yizrel@students.utdi.ac.id',
          password: 'mintabakat123',
          no_telp: '081328990009',
          jenis_kelamin: 'MALE',
          agama: 'Kristen',
          image: 'minatbakat.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user10 = await prisma.users.create({
        data: {
          nra: '312/UKM_IK/XXVII/2023',
          nim: '215410013',
          role_id: phRole.id,
          subrole_id: humasSubRole.id,
          nama: 'Hanif Firmansyah',
          username: 'humas',
          email: 'hanif.firmansyah@students.utdi.ac.id',
          password: 'humas123',
          no_telp: '081328990010',
          jenis_kelamin: 'MALE',
          agama: 'Islam',
          image: 'humas.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user11 = await prisma.users.create({
        data: {
          nra: '318/UKM_IK/XXVII/2023',
          nim: '215610034',
          role_id: phRole.id,
          subrole_id: publikasiSubRole.id,
          nama: 'Rozan Naufal',
          username: 'publikasi',
          email: 'rozan.naufal@students.utdi.ac.id',
          password: 'publikasi123',
          no_telp: '081328990011',
          jenis_kelamin: 'MALE',
          agama: 'Islam',
          image: 'publikasi.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Sistem Informasi',
          status: 'Active',
        },
    });

    const user12 = await prisma.users.create({
        data: {
          nra: '279/UKM_IK/XXVI/2021',
          nim: '205410027',
          role_id: dpoRole.id,
          subrole_id: null,
          nama: 'Asep Suherman',
          username: 'dpo',
          email: 'asep.suherman@students.utdi.ac.id',
          password: 'dpo123',
          no_telp: '081328990012',
          jenis_kelamin: 'MALE',
          agama: 'Islam',
          image: 'dpo.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user13 = await prisma.users.create({
        data: {
          nra: '330/UKM_IK/XXVIII/2024',
          nim: '215410036',
          role_id: anggotaRole.id,
          subrole_id: null,
          nama: 'Rio Ferdinand',
          username: 'anggota',
          email: 'rioy.ferdinand@students.utdi.ac.id',
          password: 'anggota123',
          no_telp: '081328990013',
          jenis_kelamin: 'MALE',
          agama: 'Kristen',
          image: 'anggota.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
    });

    const user14 = await prisma.users.create({
        data: {
          nra: null,
          nim: '215410011',
          nama: 'X',
          username: null,
          email: 'rio.ferdinand@students.utdi.ac.id',
          password: null,
          no_telp: '081328990013',
          jenis_kelamin: 'MALE',
          agama: 'Kristen',
          image: 'anggota.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
      });

    const user15 = await prisma.users.create({
        data: {
          nra: null,
          nim: '215410000',
          nama: 'Z',
          username: null,
          email: 'riox.ferdinand@students.utdi.ac.id',
          password: null,
          no_telp: '081328990013',
          jenis_kelamin: 'MALE',
          agama: 'Kristen',
          image: 'anggota.jpg',
          fakultas: 'Fakultas Teknologi Informasi',
          program_studi: 'Informatika',
          status: 'Active',
        },
      });
      


    
    console.log('Seed data created successfully.');
}

seed().catch((e) => {
    throw e;
  }).finally(async () => {
    await prisma.$disconnect();
  });
