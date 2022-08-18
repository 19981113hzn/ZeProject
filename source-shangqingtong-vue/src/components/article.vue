<template>
  <div class="main" style="background-color: #f2f5f7">
    <van-nav-bar border="false" left-arrow @click-left="gotoBack" />
    <div class="title">
      广清产业园│落户园区享地方税收优惠政策,为企业提供专项
    </div>
    <div class="content">
      清远市 | 清远市人民政府<span class="span">2022-03-21</span>
    </div>
    <p class="paragraph v1">
      广清产业园是清远先进制造业发展的重大平台，经过四年多的开发建设，
      已成为广东省重要的先进制造业基地和珠三角外围极具竞争力的产业园区，
      目前正在加速建设成新材料、智能家居、汽车零配件、生物医药（美妆）产业为代表的4个百亿级产业集群。
      围绕建设“有温度的产业园区、法治园区、效率园区、亲商园区”的要求，园区近期更推出了进一步优化营商环境的“暖园十条”。
    </p>
    <van-image
      style="margin-left: 20px; margin-right: 20px"
      :src="require('../assets/article.png')"
    />
    <p class="lastParagraph v2">
      广东广清产业园
      经过不断改革发展，园区已经具备大规模开发建设的总体框架，形成了良性循环的软硬投资环境，
      吸引了多地区企业的投资。园区地理交通条件优越，区内交通四通八达，道路宽敞平坦。园区坚持按照“规划先导、基础先行、内外资并举、可持续发展”的要求，
      本着“外向型、高起点”和“持续、快速、安全、健康”的发展理念，充分发挥园区临海区位、原料丰富、设施齐备、物流便捷和贴近市场等方面的独特优势，
      通过完善基础设施配套、稳步推进产业链招商、全面提升管理服务水平。园区配套完善，基础设施完备。
    </p>
  </div>
</template>
<script>
export default {
  name: 'article',
  data() {
    return {};
  },
  components: {},
  methods: {
    // onClickLeft() {
    //   this.$router.push('/home');
    // },
    gotoBack() {
      // this.$router.back();
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.main {
  display: flex;
  flex-direction: column;
}
.van-nav-bar__title {
  font-size: 18px;
  font-weight: 600;
}
.van-nav-bar .van-icon {
  color: #333333;
}
.title {
  padding: 12px 20px 8px 20px;
  font-size: 22px;
  font-weight: 600;
}
.content {
  font-size: 14px;
  color: #999999;
  padding: 0 15px 24px 20px;
  .span {
    margin-left: 10px;
  }
}
.paragraph {
  text-indent: 2rem;
  margin: 0;
  padding: 0 20px 14px 20px;
  color: #333333;
  font-size: 16px;
}
.lastParagraph {
  text-indent: 2rem;
  margin: 0;
  padding: 14px 20px 14px 20px;
  color: #333333;
  font-size: 16px;
}
.v1 {
  margin-bottom: 0;
}
.v2 {
  margin: 0;
}
// @nav-bar-background-color:@white;
// @nav-bar-icon-color:@red;
</style>