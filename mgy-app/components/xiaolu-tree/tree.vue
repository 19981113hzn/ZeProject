<template>
	<view>
		<view class="header">
			<u-navbar title="产品分类" bgColor="#fff" @leftClick="leftClick">
			</u-navbar>
			<search v-if="searchIf" ref="sea" @confirm="confirmSearch" />
			<view class="title">
				<scroll-view scroll-x style="width: 100%;white-space: nowrap;" :scroll-left="scrollLeft">
					<view v-for="(item,index) in tree_stack" class="inline-item" :key="index">
						<view class="inline-item" v-if="index==0" @click="backTree(item,-1)">
							<text :class="[(index==tree_stack.length-1&&!isre)?'none':'active']">全部</text>
						</view>
						<view v-if="index==0&&isre" @click="backTree(item,-2)"
							:class="[index==tree_stack.length-1&&isre]?'none inline-item':'active inline-item'">
							<i class="iconfont icon-z043 iconclass" />
							搜索结果
						</view>
						<view class="inline-item" @click="backTree(item,index)" v-if="index!=0">
							<i class="iconfont icon-z043 iconclass" />
							<text :class="index==tree_stack.length-1?'none inline-ite':'active'">
								{{item[props.label]}}
							</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view>
			<view class="container-list">
				<view class="common" v-for="(item, index) in tree" @click="handleClick(item,index)" :key="index">
					<label class="content">
						<view class="list-item" v-show="isCheck">
							<!-- 多选 -->
							<view class="checkbox" v-if="props.multiple" @click.stop="handleClick(item,-1)">
								<span v-if="isSelect(item)">
									<image class="iconfont icons" v-if="item.bx&&newCheckList.length!=0"
										style="width: 24px; height: 24px;" src="@/static/img/icon_xuanzhong.png">
									</image>
									<image class="txt" v-else style="width: 24px; height: 24px;"
										src="@/static/img/icon_xuanzhong.png" />
								</span>
								<image class="txt" v-else-if="item.qx" style="width: 24px; height: 24px;"
									src="@/static/img/icon_xuanzhong.png">
								</image>
								<image class="txt" v-else-if="item.bx" style="width: 24px; height: 24px;"
									src="@/static/img/icon_xuanzhong.png">
								</image>
								<!-- <i v-else-if="item.bx" class="iconfont icon-banxuanzhongshousuo1-shi icons" /> -->
								<image v-else style="width: 24px; height: 24px;"
									src="@/static/img/icon_weixuanzhong.png" class="txt" />
							</view>
							<!-- 单选 -->
							<view class="checkbox" v-else-if="(props.nodes?item.user?true:false:true)"
								@click.stop="handleClick(item,-1)">
								<image class="txt" v-if="radioSelect(item)" style="width: 24px; height: 24px;"
									src="@/static/img/icon_xuanzhong.png">
								</image>
								<image v-else style="width: 24px; height: 24px;"
									src="@/static/img/icon_weixuanzhong.png" class="txt" />
							</view>
						</view>
						<view class="lable-text">{{item[props.label]}}</view>
						<view class="right"><i v-if="!item.user&&item.children.length>0"
								class="iconfont icon-z043 iconclass"></i></view>
					</label>
				</view>
			</view>
		</view>
		<!-- <view class="btn box_sizing">
			<button class="sureBtn" type="primary" @click="backConfirm">确认</button>
		</view> -->
	</view>
</template>

<script src="./code.js" type="text/javascript"></script>
<style lang="scss" scoped>
	@import './css/style.scss';
	@import url("./css/icon.css");
	@import url("@/static/font/iconfont.css");
</style>
