export default function AnchorAction(item: Omnibar.AnchorItem) {
  if (item.url) {
    window.location.href = item.url;
  }
}
