<script setup lang="ts">
defineProps<{
    itemData: any
}>()
</script>
<template>
    <h2>{{ itemData.title }}</h2>
    <el-row :gutter="20">
        <el-col :xs="24" :lg="6" v-for="item in itemData.data" class="item-col">
            <a :href="item.path" target="_blank" class="item-link">
                <el-card class="item-card">
                    <div class="title-wrapper">
                        <img :src="item.logo" />
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="content">
                        {{ item.description }}
                    </div>
                </el-card>
            </a>
        </el-col>
    </el-row>
</template>

<style>
.el-row {
    margin-bottom: 20px;
}

.title-wrapper {
    display: flex;
}

.title-wrapper img {
    width: 30px;
    height: 30px;
    margin-right: 20px;
}

.content {
    flex: 1;
    color: #909399;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 14px;
    margin-top: 10px;
    height: 50px;
}

.item-card {
    height: 100% !important;
}

.item-col {
    margin-bottom: 20px;
}

.item-link {
    text-decoration: none;
}

.el-card:hover {
    border-color: #409EFF;

}
</style>