const sortFiles = () => {
    setIsIcon(!isIcon)

    const newOrder = orders === "asc" ? "desc" : "asc"
    setOrders(newOrder)
    const sortedFiles = [...items].sort((a, b) => {
      console.log("sort:", items);

      if (newOrder === "asc") {
        return a.fileName
          .localeCompare(b.fileName
          )
      } else {
        return b.fileName
          .localeCompare(a.fileName
          )
      }
    })
    console.log(sortedFiles);
    setItems(sortedFiles)


  }
