<template>
  <div>
    <van-nav-bar
      title="企业筹办"
      border="false"
      left-arrow
      @click-left="gotoBack"
    />
    <div class="one">
      <span class="paragraph"></span><span class="span">政策速递</span>
    </div>
    <div class="content">
      <van-cell-group inset>
        <van-cell @click="gobusinessGuide" title="用地事项" is-link />
        <van-cell @click="gobusinessGuide" title="规划事项" is-link />
        <van-cell @click="gobusinessGuide" title="迁移征拆" is-link />
        <van-cell @click="gobusinessGuide" title="建设事项" is-link />
        <van-cell @click="gobusinessGuide" title="水务人防" is-link />
        <van-cell @click="gobusinessGuide" title="五通事项" is-link />
        <van-cell @click="gobusinessGuide" title="道路事项" is-link />
        <van-cell @click="gobusinessGuide" title="竣工验收事项" is-link />
      </van-cell-group>
    </div>
    <div class="two">
      <span class="paragraph"></span><span class="span">进度查询</span>
    </div>
    <div class="content">
      <van-cell-group inset>
        <van-cell @click="gobusinessGuide" title="项目查询" is-link />
        <van-cell @click="gobusinessGuide" title="筹建进展更新" is-link />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'businessList',
  data() {
    return {};
  },
  components: {},
  methods: {
    gotoBack() {
      // this.$router.back();
      this.$router.go(-1);
    },
    gobusinessGuide() {
      this.$router.push('/businessGuide');
    },
  },
};
</script>

<style lang='less' scoped>
.one {
  padding: 20px 0 4px 15px;
}
.two {
  padding: 20px 0 4px 15px;
}
.span {
  margin-left: 8px;
}
.paragraph {
  border: 4px solid #2163e0;
  height: 18px;
  font-size: 14px;
  border-radius: 2px;
  /* margin: 20px 0 20px 15px; */
}
/* .content {
    padding: 0;
} */
</style>