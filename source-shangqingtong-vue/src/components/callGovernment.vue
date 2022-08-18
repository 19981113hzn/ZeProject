<template>
  <div class="main">
    <van-nav-bar
      title="服务类别选择"
      border="false"
      left-arrow
      @click-left="gotoBack"
    />
    <div class="content">
      <van-cell-group inset>
        <van-cell title="招商服务" is-link />
        <van-cell title="企业开办" is-link />
        <van-cell title="企业筹建" is-link />
        <van-cell title="政府兑现" is-link />
        <van-cell title="行政审批" is-link />
        <van-cell title="其他问题" is-link />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'callGovernment',
  data() {
    return {};
  },
  components: {},
  methods: {
    gotoBack() {
      // this.$router.push('/home')
      this.$router.back();
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  // background: 100% 100%;
  // background-color: #f2f5f7;
}
.van-nav-bar {
  .van-nav-bar__content {
    height: 44px;
  }
  .van-nav-bar__title {
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    font-family: PingFangSC-Semibold, sans-serif;
  }
  .van-icon {
    color: #000;
    width: 8px;
    height: 14px;
    font-size: 14px;
  }
}
.content {
  padding: 15px 0 0;
  .van-cell-group .van-cell {
    padding: 18px 15px;
    font-size: 16px;
    font-family: PingFangSC-Medium, sans-serif;
  }
}
</style>
<style>
html,
body {
  background: #f2f5f7;
}
</style>