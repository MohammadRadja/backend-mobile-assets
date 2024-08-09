-- CreateTable
CREATE TABLE `cabang` (
    `kode_cabang` VARCHAR(191) NOT NULL,
    `nama_cabang` VARCHAR(191) NOT NULL,
    `alamat_cabang` VARCHAR(191) NOT NULL,
    `notelp_cabang` VARCHAR(191) NOT NULL,
    `keterangan` VARCHAR(191) NULL,

    PRIMARY KEY (`kode_cabang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request` (
    `kode_request` VARCHAR(191) NOT NULL,
    `kode_cabang` VARCHAR(191) NOT NULL,
    `id_user` VARCHAR(191) NOT NULL,
    `id_barang` VARCHAR(191) NOT NULL,
    `id_satuan` VARCHAR(191) NOT NULL,
    `tanggal_request` DATETIME(3) NOT NULL,
    `department` VARCHAR(191) NOT NULL,
    `jumlah_barang` INTEGER NOT NULL,
    `keperluan` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`kode_request`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `barang` (
    `id_barang` VARCHAR(191) NOT NULL,
    `nama_barang` VARCHAR(191) NOT NULL,
    `jenis_barang` VARCHAR(191) NOT NULL,
    `id_satuan` VARCHAR(191) NOT NULL,
    `harga` DOUBLE NOT NULL,
    `stok_awal` INTEGER NOT NULL,
    `terpakai` INTEGER NOT NULL,
    `sisa` INTEGER NOT NULL,

    PRIMARY KEY (`id_barang`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `satuan_barang` (
    `id_satuan` VARCHAR(191) NOT NULL,
    `nama_satuan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_satuan`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id_user` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_id_barang_fkey` FOREIGN KEY (`id_barang`) REFERENCES `barang`(`id_barang`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_kode_cabang_fkey` FOREIGN KEY (`kode_cabang`) REFERENCES `cabang`(`kode_cabang`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request` ADD CONSTRAINT `request_id_satuan_fkey` FOREIGN KEY (`id_satuan`) REFERENCES `satuan_barang`(`id_satuan`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `barang` ADD CONSTRAINT `barang_id_satuan_fkey` FOREIGN KEY (`id_satuan`) REFERENCES `satuan_barang`(`id_satuan`) ON DELETE CASCADE ON UPDATE CASCADE;
