import { useEffect, useRef } from "react";
import gsap from "gsap";

const CountUp = ({ end, duration = 1.5 }) => {
  const countRef = useRef(null);

  useEffect(() => {
    const node = countRef.current;
    if (!node) return;

    gsap.fromTo(
      node,
      { innerHTML: 0 },
      {
        innerHTML: end,
        duration: duration,
        ease: "power2.out",
        snap: { innerHTML: 1 },
        onUpdate: function () {
          node.innerHTML = Math.ceil(this.targets()[0].innerHTML).toLocaleString();
        },
      }
    );
  }, [end, duration]);

  return <span ref={countRef}>0</span>;
};

export default CountUp;