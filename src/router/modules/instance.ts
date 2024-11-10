const Layout = () => import("@/layout/index.vue");

export default {
  path: "/instances",
  name: "Instances",
  component: Layout,
  redirect: "/instances/index",
  meta: {
    icon: "ep:files",
    title: "实例管理",
    rank: 10
  },
  children: [
    {
      path: "/instances/index",
      name: "InstancesMgnt",
      component: () => import("@/views/instances/index.vue"),
      meta: {
        title: "实例管理"
      }
    }
  ]
} satisfies RouteConfigsTable;
