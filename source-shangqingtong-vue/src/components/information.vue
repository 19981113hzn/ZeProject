<template>
  <div>
    <van-nav-bar border="false" left-arrow @click-left="gotoBack" />
    <van-image
      width="375"
      height="180"
      :src="require('../assets/img／banner(1).png')"
    />
    <van-dropdown-menu>
      <van-dropdown-item title="行政区域" ref="item">
        <van-cell>
          <button
            class="btn1"
            round
            type="default"
            size="normal"
            @click="buttonclick(1)"
            :class="buttonIndex == 1 ? 'bgcolor' : ''"
          >
            全部
          </button>
          <button
            class="btn1"
            round
            type="default"
            size="normal"
            @click="buttonclick(2)"
            :class="buttonIndex == 2 ? 'bgcolor' : ''"
          >
            清城区
          </button>
          <button
            class="btn1"
            round
            type="default"
            size="normal"
            @click="buttonclick(3)"
            :class="buttonIndex == 3 ? 'bgcolor' : ''"
          >
            清新区
          </button>
          <button
            class="btn1"
            round
            type="default"
            size="normal"
            @click="buttonclick(4)"
            :class="buttonIndex == 4 ? 'bgcolor' : ''"
          >
            英德市
          </button>
          <button
            class="btn1"
            round
            type="default"
            size="normal"
            @click="buttonclick(5)"
            :class="buttonIndex == 5 ? 'bgcolor' : ''"
          >
            连州市
          </button>
          <button
            class="btn1"
            round
            type="default"
            size="normal"
            @click="buttonclick(6)"
            :class="buttonIndex == 6 ? 'bgcolor' : ''"
          >
            佛冈县
          </button>
          <button
            class="btn1"
            round
            type="default"
            size="normal"
            @click="buttonclick(7)"
            :class="buttonIndex == 7 ? 'bgcolor' : ''"
          >
            阳山县
          </button>
          <button
            class="btn1"
            round
            type="default"
            size="normal"
            @click="buttonclick(8)"
            :class="buttonIndex == 8 ? 'bgcolor' : ''"
          >
            连南瑶族自治县
          </button>
          <button
            class="btn1"
            round
            type="default"
            size="normal"
            @click="buttonclick(9)"
            :class="buttonIndex == 9 ? 'bgcolor' : ''"
          >
            连山壮族瑶族自治县
          </button>
        </van-cell>
        <div style="padding: 5px 16px; display: flex">
          <van-button
            plain
            type="info"
            block
            round
            @click="onConfirm"
            style="margin-right: 10px"
          >
            重置
          </van-button>
          <van-button type="info" block round @click="onConfirm">
            确认
          </van-button>
        </div>
      </van-dropdown-item>
    </van-dropdown-menu>
    <div @click="goArticle" class="content">
      <div class="left">
        <p>全国100+独家代理园区政策稳定营商环境好落户流程全面代办</p>
        <span>2022.03.24</span>
      </div>
      <div class="right"><img src="../assets/article.png" alt="" /></div>
    </div>
    <div @click="goArticle" class="content">
      <div class="left">
        <p>落户园区享地方税收优惠政策，为贸易、服务等企业提供专项...</p>
        <span>2022.03.24</span>
      </div>
      <div class="right"><img src="../assets/one.png" alt="" /></div>
    </div>
    <div @click="goArticle" class="content">
      <div class="left">
        <p>推荐园区考察期超2年，地方经济实力保障，政策长期稳定</p>
        <span>2022.03.24</span>
      </div>
      <div class="right"><img src="../assets/two.png" alt="" /></div>
    </div>
    <div @click="goArticle" class="content">
      <div class="left">
        <p>免费提供注册地址，正规工商备案许可，0元代办注册</p>
        <span>2022.03.24</span>
      </div>
      <div class="right"><img src="../assets/three.png" alt="" /></div>
    </div>
    <div @click="goArticle" class="content">
      <div class="left">
        <p>顾问一对一陪同落户，服务团队全程代办，方案售后风控跟进</p>
        <span>2022.03.24</span>
      </div>
      <div class="right"><img src="../assets/four.png" alt="" /></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'information',
  data() {
    return {
      show: false,
      showmode: true,
      // mapStyle:'background:rgba(255,97,44,1);',
      // normalStyle:'',
      // choseValue:'',
      buttonIndex: 1,
    };
  },
  methods: {
    onConfirm() {
      this.$refs.item.toggle();
      this.buttonIndex = 1;
    },
    buttonclick(buttonIndex) {
      this.buttonIndex = buttonIndex;
    },
    gotoBack() {
      // this.$router.back();
      this.$router.go(-1);
    },
    goArticle() {
      this.$router.push('/article');
    },
  },
};
</script>

<style lang='less' scoped>
.van-dropdown-menu__item {
  justify-content: left !important;
  .van-ellipsis {
    margin-left: 15px;
    font-size: 16px;
    color: #171819 !important;
  }
}
.content {
  display: flex;
  .left {
    display: flex;
    flex-direction: column;
    p {
      padding: 0 14px 11px 15px;
      margin: 0;
      font-size: 16px;
    }
    span {
      padding: 0 14px 11px 15px;
      margin: 0;
      color: #9aa0a3;
      font-size: 14px;
    }
  }
  .right {
    width: 100px;
    height: 75px;
    img {
      width: 90px;
      height: 75px;
      margin-right: 15px;
    }
  }
}
.bgcolor {
  background-color: #1989fa;
  border: 0;
  outline: 0;
  color: #fff !important;
}
button {
  background: white;
  border: 0;
  color: #656c74;
  // width: 56px;
  // height: 29px;
  border-radius: 14.5px;
  font-size: 14px;
  padding: 8px 14px 7px 14px;
}
.btn1 {
  color: #656c74 !important;
}
</style>