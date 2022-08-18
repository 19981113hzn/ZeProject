<template>
  <div style="background-color: #f2f5f7">
    <van-nav-bar
      title="咨询记录"
      border="false"
      left-arrow
      @click-left="gotoBack"
    />
    <div>
      <van-dropdown-menu>
        <!-- <van-dropdown-item
          v-model="value1"
          title="咨询类型"
          :options="option1"
        />
        <van-dropdown-item
          v-model="value2"
          title="问题类型"
          :options="option2"
        />
        <van-dropdown-item
          v-model="value3"
          title="咨询状态"
          :options="option3"
        /> -->
        <van-dropdown-item
          v-for="(item, index) in option"
          :key="index"
          :title="item.title"
          :options="item.children"
          @change="handleChange"
        ></van-dropdown-item>
      </van-dropdown-menu>
    </div>
    <div class="content">
      <!-- <div class="left-title">咨询记录</div> -->
      <div @click="goCallGovernment" class="right-title">+ 发起咨询</div>
    </div>
    <div>
      <template v-if="currentValue === 0">
        <div>111111</div>
        <div>222222</div>
      </template>
      <template v-else>
        <!-- :image="require('../assets/image/无数据-内容(1).png')" -->
        <van-empty class="custom-image" description="暂无数据" />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'lookAnswer',
  data() {
    return {
      currentValue: '',
      value1: 0,
      value2: 'a',
      value3: 'A',
      option: [
        {
          title: '咨询类型',
          children: [
            { text: '服务咨询', value: 0 },
            { text: '项目咨询', value: 1 },
            { text: '其他资讯', value: 2 },
          ],
        },
        {
          title: '问题类型',
          children: [
            { text: '招商服务', value: 'a' },
            { text: '企业开办', value: 'b' },
            { text: '企业筹建', value: 'c' },
            { text: '政策兑现', value: 'd' },
            { text: '行政审批', value: 'e' },
            { text: '其他问题', value: 'f' },
          ],
        },
        {
          title: '咨询状态',
          children: [
            { text: '咨询中', value: 'A' },
            { text: '已完成', value: 'B' },
          ],
        },
      ],
      option1: [
        { text: '服务咨询', value: 0 },
        { text: '项目咨询', value: 1 },
        { text: '其他资讯', value: 2 },
      ],
      option2: [
        { text: '招商服务', value: 'a' },
        { text: '企业开办', value: 'b' },
        { text: '企业筹建', value: 'c' },
        { text: '政策兑现', value: 'd' },
        { text: '行政审批', value: 'e' },
        { text: '其他问题', value: 'f' },
      ],
      option3: [
        { text: '咨询中', value: 'A' },
        { text: '已完成', value: 'B' },
      ],
    };
  },

  components: {},
  methods: {
    gotoBack() {
      this.$router.back();
    },
    goCallGovernment() {
      this.$router.push('/callGovernment');
    },
    handleChange(v) {
      this.currentValue = v;
    },
  },
};
</script>

<style lang="less" scoped>
.van-nav-bar {
  /deep/.van-nav-bar__content {
    height: 44px;
  }
  /deep/ .van-nav-bar__title {
    font-size: 16px;
    font-weight: 700;
    color: #000000;
    font-family: PingFangSC-Semibold, sans-serif;
  }
  /deep/ .van-icon {
    color: #000;
    width: 8px;
    height: 14px;
    font-size: 14px;
  }
}

.content {
  display: flex;
  justify-content: right;
  padding: 20px 15px;
  // .left-title {
  //    font-size: 18px;
  //    font-weight: 600;
  // }
  .right-title {
    font-size: 14px;
    color: #37bbf2;
    text-align: right;
  }
  .custom-image .van-empty__image {
    /deep/ img {
      width: 160px;
      height: 120px;
    }
  }
}
</style>