<template>
  <div class="main">
    <div class="header">
      <img src="../assets/icon/black return.png" @click="gotoBack" />
      <div class="header_title">清远企业服务专区</div>
      <div class="header_conter">为企业提供一站式专属服务</div>
    </div>
    <div class="conter">
      <div class="conter_img">
        <div class="conter_header">
          <img src="../assets/icon/Icons／Chat／comment-dots1.png" />
          <span class="conter_header_title" @click="goCallGovernment"
            >呼政府</span
          >
          <img src="../assets/icon/Icons／Chat／comment-dots.png" />
          <span @click="goLookAnswer">看回应</span>
        </div>
        <div class="conter_dynamic">
          <div class="conter_dynamic_title">
            <span>我的动态</span>
            <div>
              <img src="../assets/icon/ico／emoji.png" />
              <span>项目咨询</span>
            </div>
          </div>
          <div class="conter_dynamic_data">
            <div class="label">
              <p class="label_number">2</p>
              <p class="label_title">我的项目</p>
            </div>
            <div class="label">
              <p class="label_number">8</p>
              <p class="label_title">我的工程</p>
            </div>
            <div class="label">
              <p class="label_number">8</p>
              <p class="label_title">告知清单</p>
            </div>
            <div class="label">
              <p class="label_number">9</p>
              <p class="label_title">已签代办</p>
            </div>
          </div>
        </div>
      </div>
      <div class="conter_my">
        <div class="conter_my_img1">
          <p>我的提醒</p>
        </div>
        <div class="conter_my_img2">
          <p>我的证照</p>
        </div>
        <div class="conter_my_img3">
          <p>我的信用</p>
        </div>
      </div>
      <div class="conter_park">
        <div class="conter_park_title">热门园区</div>

        <div class="conter_park_nav">
          <router-link :to="{ name: 'article' }">
            <van-cell title="广清产业园" is-link />
            <van-cell title="广佛产业园" is-link />
            <van-cell title="广德产业园" is-link />
            <van-cell title="广清空港现代物流产业新城" is-link />
          </router-link>
        </div>
      </div>
      <div class="conter_information">
        <div class="conter_information_title">资讯速递</div>
        <div class="conter_information_main">
          <div class="conter_information_main_title">
            <div class="month"><p>3月</p></div>
            <van-swipe
              style="height: 25px"
              vertical
              :show-indicators="false"
              :autoplay="2000"
            >
              <router-link :to="{ name: 'article' }">
                <van-swipe-item
                  >清远市 "三园一城" 重大项目适用税收及优惠政策指南
                  ></van-swipe-item
                >
                <van-swipe-item
                  >清远市的萨满的弥撒，达拉斯撒旦撒旦就是多久啊圣诞节可是大家</van-swipe-item
                >
              </router-link>
            </van-swipe>
          </div>
          <div class="conter_information_main_time">
            <van-cell
              title="清远市 | 清远市人民政府"
              value="2022-02-12"
              size="large"
            />
          </div>
          <div class="conter_information_main_nav">
            <div @click="goInformation" class="label">
              <img src="../assets/icon/ico／Investment01.png" />
              <p class="label_title">投资商机</p>
            </div>
            <div @click="goInformation" class="label">
              <img src="../assets/icon/ico／Investment02.png" />
              <p class="label_title">政策快讯</p>
            </div>
            <div @click="goInformation" class="label">
              <img src="../assets/icon/ico／Investment3.png" />
              <p class="label_title">地块信息</p>
            </div>
            <div @click="goInformation" class="label">
              <img src="../assets/icon/ico／Investment4.png" />
              <p class="label_title">厂房信息</p>
            </div>
            <div @click="goInformation" class="label">
              <img src="../assets/icon/ico／Investment5.png" />
              <p class="label_title">科技创新</p>
            </div>
            <div @click="goInformation" class="label">
              <img src="../assets/icon/ico／Investment6.png" />
              <p class="label_title">中介服务</p>
            </div>
            <div @click="goInformation" class="label">
              <img src="../assets/icon/ico／Investment7.png" />
              <p class="label_title">人才服务</p>
            </div>
            <div @click="goInformation" class="label">
              <img src="../assets/icon/ico／Investment8.png" />
              <p class="label_title">涉企培训</p>
            </div>
          </div>
        </div>
      </div>
      <div class="conter_services">
        <div class="conter_services_title">企业服务</div>
        <div class="conter_services_option">
          <div class="title">
            <div class="title_left">
              <img src="../assets/icon/ico／business start-up.png" />
              <p>企业开办</p>
            </div>
            <button @click="gobusinessGuide">
              <p>一键开办</p>
            </button>
          </div>
          <div class="label">
            <div @click="goBusinessList" class="label_nav label_left">
              <p>企业筹建</p>
              <van-icon name="arrow" />
            </div>
            <div @click="goBusinessList" class="label_nav">
              <p>不动产登记</p>
              <van-icon name="arrow" />
            </div>
            <div @click="goBusinessList" class="label_nav label_left">
              <p>许可办理</p>
              <van-icon name="arrow" />
            </div>
            <div @click="goBusinessList" class="label_nav">
              <p>证书查验</p>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
        <div class="conter_services_operate">
          <div class="operate_title">
            <img src="../assets/icon/ico／business start-up.png" />
            <p>企业经营</p>
          </div>
          <div class="label">
            <div @click="goBusinessList" class="label_nav label_left">
              <span>金融服务</span>
              <van-icon name="arrow" />
            </div>
            <div @click="goBusinessList" class="label_nav">
              <span>办税服务</span>
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="label">
            <div @click="goBusinessList" class="label_nav label_left">
              <span>企业年报</span>
              <van-icon name="arrow" />
            </div>
            <div @click="goBusinessList" class="label_nav">
              <span>企业维权</span>
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="label">
            <div @click="goBusinessList" class="label_nav label_left">
              <span>港澳商务签证</span>
              <van-icon name="arrow" />
            </div>
            <div @click="goBusinessList" class="label_nav">
              <span>投资审批</span>
              <van-icon name="arrow" />
            </div>
          </div>
          <div class="label">
            <div @click="goBusinessList" class="label_nav label_left">
              <span>工程建设</span>
              <van-icon name="arrow" />
            </div>
            <div @click="goBusinessList" class="label_nav">
              <span>电力报装</span>
              <van-icon name="arrow" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>由清远市政务融媒企业信用平台粤商通单位主</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {};
  },
  components: {},
  methods: {
    onClickLeft() {
      this.$router.push('/entry');
    },
    goCallGovernment() {
      this.$router.push('/callGovernment');
    },
    goLookAnswer() {
      this.$router.push('/lookAnswer');
    },
    goBusinessList() {
      this.$router.push('/businessList');
    },
    goInformation() {
      this.$router.push('/information');
    },
    gobusinessGuide() {
      this.$router.push('/businessGuide');
    },
    gotoBack() {
      // this.$router.back();
      this.$router.go(-1);
    },
  },
};
</script>


<style lang="less" scoped>
.main {
  background-image: url(../assets/entrance_slices/img／top image／def.png);
  background-repeat: no-repeat, repeat-x;
  background-color: #f3f6f8;
  .header {
    margin-left: 20px;
    img {
      margin: 59px 0 19px;
    }
    .header_title {
      height: 31px;
      font-size: 26px;
      font-family: HYYakuHei-GEW, HYYakuHei;
      font-weight: normal;
      color: #ffffff;
      line-height: 31px;
      margin-left: 6px;
    }
    .header_conter {
      height: 14px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 14px;
      letter-spacing: 3px;
      margin: 10px 0 64px 6px;
    }
  }
  .conter {
    margin: 0 15px;
    .conter_img {
      background-image: url(../assets/entrance_slices/img／def2.png);
      background-size: 100% 100%;
      .conter_header {
        padding: 12px 58px 27px 58px;
        display: flex;
        align-items: center;
        .conter_header_title {
          margin-right: 73px;
        }
        span {
          margin: 3px 0 3px 8px;
          height: 16px;
          font-size: 16px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #171819;
          line-height: 16px;
        }
      }
      .conter_dynamic {
        .conter_dynamic_title {
          display: flex;
          span {
            padding: 8px 159px 6px 20px;
            height: 16px;
            font-size: 16px;
            font-family: PingFang-SC-Heavy, PingFang-SC;
            font-weight: 800;
            color: #171819;
            line-height: 16px;
          }
          div {
            display: flex;
            width: 102px;
            height: 30px;
            background: #edf6fe;
            border: 0;
            border-radius: 100px 0px 0px 100px;
            padding: 0;
            img {
              padding: 8px 4px 8px 16px;
            }
            span {
              height: 12px;
              font-size: 12px;
              font-family: PingFang-SC-Medium, PingFang-SC;
              font-weight: 500;
              color: #2163e0;
              line-height: 12px;
              padding: 9px 20px 9px 0;
            }
          }
        }
        .conter_dynamic_data {
          display: flex;
          .label {
            width: 25%;
            text-align: center;
            .label_number {
              height: 14px;
              font-size: 18px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #171819;
              line-height: 14px;
              margin: 22px 20px 7px 21px;
            }
            .label_title {
              height: 14px;
              font-size: 13px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #9aa0a3;
              line-height: 14px;
            }
          }
        }
      }
    }
    .conter_my {
      display: flex;
      align-items: center;
      margin-top: 14px;
      .conter_my_img1 {
        background-image: url(../assets/icon/ico／my remind.png);
        background-size: 100% 100%;
        margin-right: 9px;
      }
      .conter_my_img2 {
        background-image: url(../assets/icon/ico／my documents.png);
        background-size: 100% 100%;
        margin-right: 9px;
      }
      .conter_my_img3 {
        background-image: url(../assets/icon/ico／my CEDIT.png);
        background-size: 100% 100%;
      }
      p {
        margin: 0;
        padding: 16px 38px 30px 15px;
        height: 14px;
        font-size: 14px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #171819;
        line-height: 14px;
      }
    }
    .conter_park {
      .conter_park_title {
        margin: 32px 0 21px 0;
        height: 18px;
        font-size: 18px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #171819;
        line-height: 18px;
      }
      .conter_park_nav {
        background: #ffffff;
        border-radius: 6px;
        overflow: hidden;
        .van-cell__title {
          height: 22px;
          font-size: 16px;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #171819;
          line-height: 22px;
        }
      }
    }
    .conter_information {
      .conter_information_title {
        margin: 32px 0 20px 0;
        height: 18px;
        font-size: 18px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #171819;
        line-height: 18px;
      }
      .conter_information_main {
        background: #ffffff;
        border-radius: 6px;
        padding: 15px;
        .conter_information_main_title {
          display: flex;
          align-items: center;
          .month {
            width: 30px;
            height: 21px;
            background: #2163e0;
            border-radius: 2px;
            p {
              width: 20px;
              margin: 0;
              padding: 5px 5px;
              height: 12px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #ffffff;
              line-height: 12px;
            }
          }
          .van-swipe-item {
            margin: 2px 7px 0 4px;
            height: 17px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #171819;
            line-height: 17px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .conter_information_main_time {
          border-bottom: 1px solid #e3e8ed;
          .van-cell--large {
            padding: 15px 0;
            .van-cell__title {
              // margin: 15px 0 15px 0;
              height: 12px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #9aa0a3;
              line-height: 12px;
            }
            .van-cell__value {
              height: 12px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #9aa0a3;
              line-height: 12px;
            }
          }
        }
        .conter_information_main_nav {
          display: flex;
          flex-wrap: wrap;
          .label {
            width: 25%;
            img {
              margin: 15px 15px;
            }
            .label_title {
              margin: 0;
              height: 14px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #171819;
              line-height: 14px;
            }
          }
        }
      }
    }
    .conter_services {
      margin-bottom: 40px;
      .conter_services_title {
        margin: 32px 0 20px 0;
        height: 18px;
        font-size: 18px;
        font-family: PingFang-SC-Bold, PingFang-SC;
        font-weight: bold;
        color: #171819;
        line-height: 18px;
      }
      .conter_services_option {
        padding: 10px 15px;
        background: #ffffff;
        border-radius: 6px;
        .title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px #e3e8ed solid;
          .title_left {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            p {
              margin: 0;
              margin: 11px 8px;
              height: 16px;
              font-size: 16px;
              font-family: PingFang-SC-Heavy, PingFang-SC;
              font-weight: 800;
              color: #171819;
              line-height: 16px;
            }
          }
          button {
            padding: 0;
            margin: 8px 0;
            margin-bottom: 20px;
            border: none;
            border-radius: 100px;
            background-color: #2163e0;
            p {
              margin: 8px 20px;
              height: 12px;
              font-size: 11px;
              font-family: PingFang-SC-Medium, PingFang-SC;
              font-weight: 500;
              color: #ffffff;
              line-height: 12px;
            }
          }
        }
      }
      .conter_services_operate {
        margin: 15px 0;
        padding: 10px 15px;
        background: #ffffff;
        border-radius: 6px;
        .operate_title {
          padding-bottom: 5px;
          display: flex;
          align-items: center;
          border-bottom: 1px #e3e8ed solid;
          p {
            margin-left: 8px;
            height: 16px;
            font-size: 16px;
            font-family: PingFang-SC-Heavy, PingFang-SC;
            font-weight: 800;
            color: #171819;
            line-height: 16px;
          }
        }
      }
      .label {
        display: flex;
        flex-wrap: wrap;
        box-sizing: border-box;
        .label_nav {
          width: 45%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin: 15px 0;
          p {
            margin: 0;
            height: 22px;
            font-size: 16px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #171819;
            line-height: 22px;
          }
          .van-icon {
            color: #c4cacd;
            font-size: 16px;
          }
        }
        .label_left {
          margin-right: 18px;
          border-right: 1px #e3e8ed solid;
          .van-icon {
            padding-right: 18px;
          }
        }
      }
    }
  }
  .footer {
    padding-bottom: 10px;
    text-align: center;
    height: 12px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #c3cbcf;
    line-height: 12px;
  }
}
</style>
