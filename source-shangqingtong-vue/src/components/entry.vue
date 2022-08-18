<template>
  <div class="content">
    <div class="main">
      <router-link :to="{ name: 'home' }">
        <div class="title">
          <span>清远</span>
          <img src="../assets/icon/ico／go.png" />
        </div>
      </router-link>
      <div class="title">
        <p>为企业提供一站式专属服务</p>
      </div>
      <div class="service">
        <van-cell title="招商全程服务" is-link value="更多" to="/home" />
        <div class="service_nav">
          <div class="nav_label">
            <img src="../assets/icon/ico／box／1.png" />
            <span>一站式代办</span>
          </div>
          <div class="nav_label">
            <img src="../assets/icon/ico／box／1备份.png" />
            <span>进度查看</span>
          </div>
          <div class="nav_label">
            <img src="../assets/icon/ico／box／1备份 2.png" />
            <span>快速响应</span>
          </div>
        </div>
      </div>
      <div class="guide">
        <div class="guide_main">
          <router-link :to="{ name: 'article' }">
            <div class="guide_nav">
              <div class="investment">
                <img
                  src="../assets/entrance_slices/img／investment opportunities.png"
                />
              </div>
              <div class="guide_nav_title">
                清远市 "三园一城" 重大项目适用税收及优惠政策指南 >
              </div>
            </div>
          </router-link>
          <div class="guide_hot">
            <van-cell title="热门园区" is-link value="更多" to="/home" />
            <router-link :to="{ name: 'article' }">
              <div class="guide_hot_nav">
                <div class="label">
                  <img src="../assets/icon/ico／industry 1.png" />
                  <!-- <div class="label_img"></div> -->
                  <p class="label_title">广清产业园</p>
                </div>
                <div class="label">
                  <img src="../assets/icon/ico／industry 2.png" />
                  <!-- <div class="label_img"></div> -->
                  <p class="label_title">广佛产业园</p>
                </div>
                <div class="label">
                  <img src="../assets/icon/ico／industry 3.png" />
                  <!-- <div class="label_img"></div> -->
                  <p class="label_title">广德产业园</p>
                </div>
                <div class="label">
                  <img src="../assets/icon/ico／industry 4.png" />
                  <!-- <div class="label_img"></div> -->
                  <p class="label_title">广清空港现代物流产业新城</p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'entry',
  data() {
    return {};
  },
  components: {},
  methods: {
    goHome() {
      this.$router.push('/home');
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  box-sizing: border-box;
  margin-left: 16px;
  margin-right: 14px;
  background-image: url(../assets/entrance_slices/img／entrance.png);
  background-size: 100% 100%;
  .main {
    padding: 21px 14px;
    .title {
      span {
        height: 18px;
        font-size: 18px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 18px;
      }
      img {
        padding-left: 8px;
      }
      p {
        height: 14px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 14px;
      }
    }
    .service {
      margin-top: 16px;
      background: #ffffff;
      border-radius: 4px;
      padding: 13px 14px 14px 15px;
      .van-cell {
        padding: 0;
        margin-left: 1px;
        .van-cell__title {
          height: 16px;
          font-size: 16px;
          font-family: PingFang-SC-Bold, PingFang-SC;
          font-weight: bold;
          color: #171819;
          line-height: 16px;
        }
        .van-cell__value {
          height: 14px;
          font-size: 14px;
          font-family: PingFang-SC-Medium, PingFang-SC;
          font-weight: 500;
          color: #b2b8bd;
          line-height: 14px;
        }
        .van-cell__right-icon {
          font-size: 6px;
          height: 6px;
          line-height: 6px;
          color: #b2b8bd;
          margin: 4px 0 4px 7px;
        }
      }
      .van-cell::after {
        border: 0;
      }
      .service_nav {
        display: flex;
        margin-top: 24px;
        justify-content: space-between;
        .nav_label {
          img {
            vertical-align: sub;
            margin-right: 3px;
          }
          span {
            height: 14px;
            font-size: 13px;
            font-family: PingFang-SC-Medium, PingFang-SC;
            font-weight: 500;
            color: #656c74;
            line-height: 14px;
          }
          font-size: 12px;
        }
      }
    }
    .guide {
      margin-top: 15px;
      background-color: #ffffff;
      border-radius: 4px;
      .guide_main {
        .guide_nav {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          margin: 0 15px;
          padding-top: 10px;
          border-bottom: 1px #e3e8ed solid;
          .investment {
            margin-bottom: 10px;
          }
          .guide_nav_title {
            flex: 1;
            height: 34px;
            font-size: 13px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            padding: 2px 0 2px 9px;
            color: #171819;
            line-height: 17px;
          }
        }
        .guide_hot {
          .van-cell {
            padding: 13px 15px;
            .van-cell__title {
              height: 16px;
              font-size: 16px;
              font-family: PingFang-SC-Bold, PingFang-SC;
              font-weight: bold;
              color: #171819;
              line-height: 16px;
            }
            .van-cell__value {
              height: 14px;
              font-size: 14px;
              font-family: PingFang-SC-Medium, PingFang-SC;
              font-weight: 500;
              color: #b2b8bd;
              line-height: 14px;
            }
            .van-cell__right-icon {
              font-size: 6px;
              height: 6px;
              line-height: 6px;
              color: #b2b8bd;
              margin: 4px 0 4px 7px;
            }
          }
          .van-cell::after {
            border: 0;
          }
          .guide_hot_nav {
            display: flex;
            justify-content: space-between;
            margin: 0 9px 10px 16px;
            .label {
              width: 25%;
              margin-bottom: 15px;
              img {
                margin: 0 6px 8px 10px;
              }
              .label_title {
                margin: 0;
                height: 28px;
                font-size: 11px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #171819;
                line-height: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>