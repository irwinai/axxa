<script setup lang="ts">
import { ref } from 'vue';
import nacl from 'tweetnacl';
import naclUtil from 'tweetnacl-util';
import Clipboard from 'clipboard';
import { ElMessage } from 'element-plus'

let loading = ref(false);
let generated = ref(false)
let publicKey = ref('')
let privateKey = ref('')


const generate = () => {
  loading.value = true;

  const keyPair = nacl.sign.keyPair();
  publicKey.value = naclUtil.encodeBase64(keyPair.publicKey);
  privateKey.value = naclUtil.encodeBase64(keyPair.secretKey);

  console.log('Public Key:', publicKey);
  console.log('Private Key:', privateKey);

  loading.value = false
  generated.value = true
}

const copyText = (key: string) => {
  const clipboard = new Clipboard('button', {
    text: () => key
  });

  clipboard.on('success', (e) => {
    ElMessage({
      message: '文本已复制',
      type: 'success',
    })
    e.clearSelection();
    clipboard.destroy();
  });

  clipboard.on('error', (e) => {
    ElMessage.error('复制失败')
    clipboard.destroy();
  });
}
</script>

<template>
  <el-form label-width="120px" status-icon>
    <el-button type="primary" @click="generate()" :loading="loading">
      生成ed25519秘钥
    </el-button>
  </el-form>
  <div v-if="generated">
    <p>
      公钥：{{ publicKey }}
      <el-button type="info" @click="copyText(publicKey)">
        复制
      </el-button>
    </p>
    <p>
      私钥：{{ privateKey }}
      <el-button type="info" @click="copyText(privateKey)">
        复制
      </el-button>
    </p>
  </div>
</template>

<style></style>
